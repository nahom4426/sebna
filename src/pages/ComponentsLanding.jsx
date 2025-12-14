import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Select,
  Form,
  Table,
  Card,
  Modal,
  Badge,
  Alert,
  Textarea,
  Checkbox,
} from '../components';

const ComponentsLanding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: '',
    agree: false,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Sample data for table
  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', amount: 'ETB 5,000' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending', amount: 'ETB 10,000' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', status: 'Inactive', amount: 'ETB 7,500' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', status: 'Active', amount: 'ETB 12,000' },
  ];

  const tableColumns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <Badge variant={value === 'Active' ? 'success' : value === 'Pending' ? 'warning' : 'danger'}>
          {value}
        </Badge>
      ),
    },
    { key: 'amount', label: 'Amount', sortable: true },
  ];

  const categoryOptions = [
    { value: 'investment', label: 'Investment' },
    { value: 'support', label: 'Support' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'other', label: 'Other' },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
    setFormData({ name: '', email: '', category: '', message: '', agree: false });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-blue-900">Sebna</h1>
            <div className="hidden md:flex gap-6">
              <button 
                onClick={() => window.scrollTo(0, 0)}
                className="text-gray-600 hover:text-blue-900 transition-colors font-medium"
              >
                Components
              </button>
              <a 
                href="#" 
                className="text-gray-600 hover:text-blue-900 transition-colors font-medium"
              >
                Documentation
              </a>
            </div>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/auth/sign-in')}
            >
              Sign In
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => navigate('/dashboard/home')}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-orange-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Sebna Components Library</h1>
          <p className="text-xl opacity-90">
            A comprehensive collection of reusable React components for building modern applications
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Buttons</h2>
          <Card title="Button Variants" subtitle="Different button styles and sizes">
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Variants</h4>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="success">Success Button</Button>
                  <Button variant="danger">Danger Button</Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Sizes</h4>
                <div className="flex flex-wrap gap-3 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">With Icons</h4>
                <div className="flex flex-wrap gap-3">
                  <Button icon="fa-rocket">Launch</Button>
                  <Button icon="fa-download" variant="secondary">
                    Download
                  </Button>
                  <Button icon="fa-trash" variant="danger">
                    Delete
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">States</h4>
                <div className="flex flex-wrap gap-3">
                  <Button disabled>Disabled Button</Button>
                  <Button loading>Loading Button</Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Form Inputs Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Form Components</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Card */}
            <Card title="Contact Form" subtitle="Complete form with validation">
              <Form onSubmit={handleFormSubmit} submitButtonText="Send Message">
                <Input
                  label="Full Name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  icon="fa-user"
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  icon="fa-envelope"
                  required
                />

                <Select
                  label="Category"
                  name="category"
                  options={categoryOptions}
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />

                <Textarea
                  label="Message"
                  name="message"
                  placeholder="Enter your message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={500}
                />

                <Checkbox
                  label="I agree to the terms and conditions"
                  checked={formData.agree}
                  onChange={handleInputChange}
                  name="agree"
                />
              </Form>
            </Card>

            {/* Input Examples */}
            <Card title="Input Variants" subtitle="Different input types and states">
              <div className="space-y-4">
                <Input
                  label="Text Input"
                  placeholder="Enter text"
                  icon="fa-keyboard"
                />

                <Input
                  label="Email Input"
                  type="email"
                  placeholder="Enter email"
                  icon="fa-envelope"
                />

                <Input
                  label="Password Input"
                  type="password"
                  placeholder="Enter password"
                  icon="fa-lock"
                />

                <Input
                  label="Number Input"
                  type="number"
                  placeholder="Enter amount"
                  icon="fa-dollar-sign"
                />

                <Input
                  label="Disabled Input"
                  placeholder="Disabled field"
                  disabled
                />

                <Input
                  label="Input with Error"
                  placeholder="This field has an error"
                  error="This field is required"
                />
              </div>
            </Card>
          </div>
        </section>

        {/* Alerts Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Alerts</h2>
          <Card title="Alert Variants" subtitle="Different alert types">
            <div className="space-y-4">
              <Alert variant="success" title="Success!">
                Your investment has been processed successfully. You will receive a confirmation email shortly.
              </Alert>

              <Alert variant="error" title="Error!">
                Something went wrong. Please try again or contact support.
              </Alert>

              <Alert variant="warning" title="Warning">
                Your investment amount is below the recommended minimum. Consider increasing your investment.
              </Alert>

              <Alert variant="info" title="Information">
                New investment opportunities are available. Check the investment section for more details.
              </Alert>
            </div>
          </Card>
        </section>

        {/* Badges Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Badges</h2>
          <Card title="Badge Variants" subtitle="Different badge styles">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Variants</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Danger</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">With Icons</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success" icon="fa-check">
                    Approved
                  </Badge>
                  <Badge variant="warning" icon="fa-clock">
                    Pending
                  </Badge>
                  <Badge variant="danger" icon="fa-times">
                    Rejected
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Sizes</h4>
                <div className="flex flex-wrap gap-2 items-center">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Table Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Data Table</h2>
          <Card title="Investment Records" subtitle="Sortable and interactive table">
            <Table
              columns={tableColumns}
              data={tableData}
              onRowClick={(row) => {
                setSelectedRow(row);
                setModalOpen(true);
              }}
            />
          </Card>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
              title="Investment Growth"
              subtitle="Your portfolio performance"
              footer={<Button size="sm" variant="outline">View Details</Button>}
            >
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-blue-900">+25.5%</p>
                <p className="text-gray-600 mt-2">Total Return on Investment</p>
              </div>
            </Card>

            <Card
              title="Active Investors"
              subtitle="Community growth"
              footer={<Button size="sm" variant="outline">Learn More</Button>}
            >
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-green-600">15,247</p>
                <p className="text-gray-600 mt-2">Active investors on platform</p>
              </div>
            </Card>

            <Card
              title="Total Investment"
              subtitle="Funds under management"
              footer={<Button size="sm" variant="outline">View Report</Button>}
            >
              <div className="text-center py-4">
                <p className="text-4xl font-bold text-orange-600">ETB 250M</p>
                <p className="text-gray-600 mt-2">Total capital invested</p>
              </div>
            </Card>
          </div>
        </section>

        {/* Modal Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Modal Dialog</h2>
          <Card title="Modal Example" subtitle="Click the button to open modal">
            <Button onClick={() => setModalOpen(true)} variant="primary">
              Open Modal
            </Button>

            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title={selectedRow ? `Investor Details - ${selectedRow.name}` : 'Sample Modal'}
              size="md"
              footer={
                <>
                  <Button variant="secondary" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary">Save Changes</Button>
                </>
              }
            >
              {selectedRow ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-gray-900">{selectedRow.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{selectedRow.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge variant={selectedRow.status === 'Active' ? 'success' : 'warning'}>
                      {selectedRow.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Investment Amount</p>
                    <p className="font-semibold text-gray-900">{selectedRow.amount}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">
                  This is a sample modal. Click on a table row to view investor details.
                </p>
              )}
            </Modal>
          </Card>
        </section>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Component Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: 'fa-cube',
                title: 'Reusable Components',
                description: 'Build faster with pre-built, customizable components',
              },
              {
                icon: 'fa-palette',
                title: 'Consistent Styling',
                description: 'Tailwind CSS integration for beautiful, responsive designs',
              },
              {
                icon: 'fa-bolt',
                title: 'Performance Optimized',
                description: 'Lightweight components with minimal bundle size',
              },
              {
                icon: 'fa-accessibility',
                title: 'Accessible',
                description: 'Built with accessibility standards in mind',
              },
              {
                icon: 'fa-mobile-alt',
                title: 'Responsive Design',
                description: 'Works perfectly on all devices and screen sizes',
              },
              {
                icon: 'fa-code',
                title: 'Easy to Customize',
                description: 'Props-based customization for maximum flexibility',
              },
            ].map((feature, index) => (
              <Card key={index}>
                <div className="text-center">
                  <div className="text-4xl text-blue-900 mb-3">
                    <i className={`fas ${feature.icon}`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-900 to-orange-600 text-white rounded-lg p-12 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Something Amazing?</h2>
          <p className="text-xl opacity-90 mb-8">
            Use these components to create beautiful, responsive applications with ease.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate('/dashboard/home')}
            >
              Go to Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/auth/sign-in')}
            >
              Sign In
            </Button>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="opacity-75">
            © 2024 Sebna S.C Components Library. Built with React and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ComponentsLanding;
