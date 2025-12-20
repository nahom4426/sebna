import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import {
  downloadMessageAttachment,
  getMessageContacts,
  getMessageThread,
  sendMultipartMessage,
  sendTextMessage,
} from '../api/MessagesApi';

const Messages = () => {
  const auth = useAuthStore((state) => state.auth);
  const myUuid = auth?.user?.userUuid || auth?.user?.id;

  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactsError, setContactsError] = useState('');
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const hasLoadedContactsRef = useRef(false);

  const [threadMessages, setThreadMessages] = useState([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadError, setThreadError] = useState('');
  const [threadPage, setThreadPage] = useState(0);
  const [threadHasMore, setThreadHasMore] = useState(false);

  const [text, setText] = useState('');
  const [fileToSend, setFileToSend] = useState(null);
  const [sending, setSending] = useState(false);

  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  const threadEndRef = useRef(null);

  const formatBytes = (bytes) => {
    const n = Number(bytes || 0);
    if (!n) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(n) / Math.log(1024)), units.length - 1);
    const val = (n / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1);
    return `${val} ${units[i]}`;
  };

  const sortThread = (list) => {
    return [...list].sort((a, b) => {
      const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return ta - tb;
    });
  };

  const extractPage = (data) => {
    const base = data?.content ? data : (data?.response || data?.data || data);
    if (Array.isArray(base)) {
      return { content: base, totalPages: 1 };
    }
    return {
      content: Array.isArray(base?.content) ? base.content : [],
      totalPages: base?.totalPages ?? 1,
    };
  };

  const fetchContacts = async ({ silent = false } = {}) => {
    const shouldShowLoading = !silent || !hasLoadedContactsRef.current;
    if (shouldShowLoading) {
      setContactsLoading(true);
    }
    setContactsError('');
    try {
      const res = await getMessageContacts();
      if (res?.success) {
        const data = res.data;
        const list = data?.content || data?.contacts || data?.response || data || [];
        setContacts(Array.isArray(list) ? list : []);
        hasLoadedContactsRef.current = true;
      } else {
        setContacts([]);
        setContactsError(res?.error || 'Failed to load contacts');
      }
    } catch (e) {
      setContacts([]);
      setContactsError(e?.message || 'Failed to load contacts');
    } finally {
      if (shouldShowLoading) {
        setContactsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchContacts();
    const t = setInterval(() => {
      fetchContacts({ silent: true });
    }, 60000);
    return () => clearInterval(t);
  }, []);

  const filteredContacts = useMemo(() => {
    const q = contactSearch.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) => {
      const name = `${c.fullName || ''}`.toLowerCase();
      const role = `${c.roleName || ''}`.toLowerCase();
      const inst = `${c.institutionName || ''}`.toLowerCase();
      return name.includes(q) || role.includes(q) || inst.includes(q);
    });
  }, [contacts, contactSearch]);

  const fetchThreadPage = async (otherUserUuid, pageNum) => {
    setThreadLoading(true);
    setThreadError('');
    try {
      const res = await getMessageThread(otherUserUuid, pageNum, 20);
      if (!res?.success) {
        setThreadError(res?.error || 'Failed to load messages');
        return;
      }
      const { content, totalPages } = extractPage(res.data);
      const list = Array.isArray(content) ? content : [];
      if (pageNum === 0) {
        setThreadMessages(sortThread(list));
      } else {
        setThreadMessages((prev) => sortThread([...list, ...prev]));
      }
      setThreadPage(pageNum);
      setThreadHasMore(pageNum + 1 < (totalPages || 1));
    } catch (e) {
      setThreadError(e?.message || 'Failed to load messages');
    } finally {
      setThreadLoading(false);
    }
  };

  useEffect(() => {
    const other = selectedContact?.userUuid;
    if (!other) return;
    setThreadMessages([]);
    setThreadHasMore(false);
    setThreadPage(0);
    fetchThreadPage(other, 0);
  }, [selectedContact?.userUuid]);

  useEffect(() => {
    if (!threadEndRef.current) return;
    threadEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [selectedContact?.userUuid, threadMessages.length]);

  const getMessageId = (m) => m?.messageId || m?.id;

  const isMine = (m) => {
    const sender = m?.senderUserUuid || m?.senderUuid || m?.senderUserId || m?.senderId;
    return myUuid && sender && String(sender) === String(myUuid);
  };

  const handleDownloadAttachment = async (m) => {
    const messageId = getMessageId(m);
    if (!messageId) return;
    try {
      const res = await downloadMessageAttachment(messageId);
      if (!res?.success) return;
      const blob = res.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = m?.fileName || `attachment-${messageId}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {}
  };

  const sendCurrentMessage = async () => {
    const receiverUserUuid = selectedContact?.userUuid;
    if (!receiverUserUuid || sending) return;
    const trimmed = text.trim();
    if (!trimmed && !fileToSend) return;

    setSending(true);
    try {
      let res;
      if (fileToSend) {
        res = await sendMultipartMessage({
          receiverUserUuid,
          type: 'FILE',
          content: trimmed || undefined,
          file: fileToSend,
        });
      } else {
        res = await sendTextMessage(receiverUserUuid, trimmed);
      }

      if (res?.success) {
        const created = res.data;
        if (created) {
          setThreadMessages((prev) => sortThread([...prev, created]));
        } else {
          await fetchThreadPage(receiverUserUuid, 0);
        }
        setText('');
        setFileToSend(null);
      }
    } catch (e) {}
    finally {
      setSending(false);
    }
  };

  const startRecording = async () => {
    if (recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) recordedChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const receiverUserUuid = selectedContact?.userUuid;
        if (!receiverUserUuid || !blob.size) return;
        setSending(true);
        try {
          const res = await sendMultipartMessage({
            receiverUserUuid,
            type: 'VOICE',
            file: new File([blob], `voice-${Date.now()}.webm`, { type: 'audio/webm' }),
          });
          if (res?.success && res.data) {
            setThreadMessages((prev) => sortThread([...prev, res.data]));
          } else {
            await fetchThreadPage(receiverUserUuid, 0);
          }
        } catch (e) {}
        finally {
          setSending(false);
        }
      };
      recorder.start();
      setRecording(true);
    } catch (e) {
      setRecording(false);
    }
  };

  const stopRecording = () => {
    if (!recording) return;
    try {
      mediaRecorderRef.current?.stop();
    } catch (e) {}
    finally {
      setRecording(false);
    }
  };

  return (
    <div className="h-full min-h-[70vh] flex flex-col md:flex-row gap-3">
      <div className="w-full md:w-80 lg:w-96 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-gray-900">Messages</div>
            <button
              type="button"
              onClick={() => fetchContacts({ silent: true })}
              className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
            >
              Refresh
            </button>
          </div>
          <div className="mt-3">
            <input
              value={contactSearch}
              onChange={(e) => setContactSearch(e.target.value)}
              placeholder="Search contacts..."
              className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
            />
          </div>
          {contactsError && (
            <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {contactsError}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto">
          {contactsLoading ? (
            <div className="p-4 text-sm text-gray-500">Loading contacts...</div>
          ) : (
            <div className="p-2">
              {filteredContacts.length === 0 ? (
                <div className="p-4 text-sm text-gray-500">No contacts</div>
              ) : (
                filteredContacts.map((c) => {
                  const active = selectedContact?.userUuid && c.userUuid && String(selectedContact.userUuid) === String(c.userUuid);
                  return (
                    <button
                      key={c.userUuid}
                      type="button"
                      onClick={() => setSelectedContact(c)}
                      className={`w-full text-left p-3 rounded-xl transition-all border ${active ? 'bg-blue-50 border-blue-200' : 'bg-white border-transparent hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-900 to-orange-600 text-white flex items-center justify-center font-bold">
                            {(c.fullName || 'U').trim().charAt(0).toUpperCase()}
                          </div>
                          <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${c.online ? 'bg-green-500' : 'bg-gray-300'}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-semibold text-gray-900 truncate">{c.fullName || 'Unknown'}</div>
                            <div className="text-[11px] text-gray-500 whitespace-nowrap">{c.lastActiveText || ''}</div>
                          </div>
                          <div className="text-xs text-gray-600 truncate">
                            {c.roleName ? `${c.roleName}` : ''}{c.institutionName ? ` • ${c.institutionName}` : ''}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        {!selectedContact ? (
          <div className="flex-1 flex items-center justify-center p-8 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 mb-2">Select a contact</div>
              <div className="text-gray-600">Choose a user on the left to start chatting.</div>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-900 to-orange-600 text-white flex items-center justify-center font-bold">
                    {(selectedContact.fullName || 'U').trim().charAt(0).toUpperCase()}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${selectedContact.online ? 'bg-green-500' : 'bg-gray-300'}`} />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-gray-900 truncate">{selectedContact.fullName}</div>
                  <div className="text-xs text-gray-600 truncate">{selectedContact.lastActiveText || ''}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fetchThreadPage(selectedContact.userUuid, 0)}
                className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
                disabled={threadLoading}
              >
                Refresh
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3">
              {threadError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
                  {threadError}
                </div>
              )}

              {threadHasMore && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => fetchThreadPage(selectedContact.userUuid, threadPage + 1)}
                    disabled={threadLoading}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {threadLoading ? 'Loading...' : 'Load older messages'}
                  </button>
                </div>
              )}

              {threadMessages.length === 0 && !threadLoading ? (
                <div className="text-sm text-gray-500">No messages yet.</div>
              ) : (
                threadMessages.map((m, idx) => {
                  const mine = isMine(m);
                  const type = m?.type || (m?.fileName ? 'FILE' : 'TEXT');
                  const hasAttachment = Boolean(m?.fileName || m?.mimeType || m?.fileSize);
                  return (
                    <div key={getMessageId(m) || idx} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm border ${mine ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-gray-900 border-gray-200'}`}>
                        {type === 'TEXT' && (
                          <div className="text-sm whitespace-pre-line">{m?.content || ''}</div>
                        )}

                        {(type === 'FILE' || type === 'VOICE') && (
                          <div className="space-y-2">
                            {m?.content ? (
                              <div className="text-sm whitespace-pre-line">{m.content}</div>
                            ) : null}
                            <div className={`flex items-center justify-between gap-3 rounded-xl p-3 ${mine ? 'bg-white/10' : 'bg-gray-50'}`}>
                              <div className="min-w-0">
                                <div className={`text-sm font-semibold truncate ${mine ? 'text-white' : 'text-gray-900'}`}>
                                  {m?.fileName || (type === 'VOICE' ? 'Voice message' : 'Attachment')}
                                </div>
                                <div className={`text-xs truncate ${mine ? 'text-white/80' : 'text-gray-600'}`}>
                                  {m?.mimeType ? `${m.mimeType}` : ''}{m?.fileSize ? `${m?.mimeType ? ' • ' : ''}${formatBytes(m.fileSize)}` : ''}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDownloadAttachment(m)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${mine ? 'bg-white text-blue-900 hover:bg-gray-100' : 'bg-blue-900 text-white hover:bg-orange-600'} transition-colors`}
                                disabled={!hasAttachment}
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        )}

                        <div className={`mt-2 text-[11px] ${mine ? 'text-white/70' : 'text-gray-500'}`}>
                          {m?.createdAt ? new Date(m.createdAt).toLocaleString() : ''}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={threadEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex flex-col gap-2">
                {fileToSend && (
                  <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-sm text-gray-800 truncate">{fileToSend.name}</div>
                    <button
                      type="button"
                      onClick={() => setFileToSend(null)}
                      className="text-sm font-semibold text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="flex items-end gap-2">
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                    disabled={sending}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendCurrentMessage();
                      }
                    }}
                  />

                  <label className="w-11 h-11 rounded-2xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer transition-colors">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setFileToSend(f);
                      }}
                    />
                    <span className="text-gray-700 font-bold">+</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => (recording ? stopRecording() : startRecording())}
                    className={`px-4 h-11 rounded-2xl flex items-center justify-center font-semibold transition-colors ${recording ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    disabled={sending}
                  >
                    {recording ? 'Stop' : 'Mic'}
                  </button>

                  <button
                    type="button"
                    onClick={sendCurrentMessage}
                    disabled={sending || (!text.trim() && !fileToSend)}
                    className="px-5 h-11 rounded-2xl bg-gradient-to-r from-blue-900 to-orange-600 text-white font-semibold hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
