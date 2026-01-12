import { useLocation, Link } from "react-router-dom";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Breadcrumbs,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  Cog6ToothIcon,
  BellIcon,
  ClockIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import {
  useMaterialTailwindController,
  setOpenConfigurator,
  setOpenSidenav,
} from "@/context";
import { useI18n } from "@/i18n/I18nContext";
import brandLogo from "@/assets/logo.svg";

export function DashboardNavbar() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { fixedNavbar, openSidenav } = controller;
  const { lang, setLang, t } = useI18n();
  const { pathname } = useLocation();
  const [layout, page] = pathname.split("/").filter((el) => el !== "");
  const currentLangLabel = lang === 'am' ? 'አማ' : lang === 'ti' ? 'ትግ' : 'EN';

  return (
    <Navbar
      color={fixedNavbar ? "white" : "transparent"}
      className={`rounded-xl transition-all ${
        fixedNavbar
          ? "sticky top-4 z-40 py-3 shadow-md shadow-sebna-navy/10"
          : "px-0 py-1"
      }`}
      fullWidth
      blurred={fixedNavbar}
    >
      <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
        <div className="capitalize">
          <Breadcrumbs
            className={`bg-transparent p-0 transition-all ${
              fixedNavbar ? "mt-1" : ""
            }`}
          >
            <Link to={`/${layout}`}>
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100"
              >
                {layout}
              </Typography>
            </Link>
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal"
            >
              {page}
            </Typography>
          </Breadcrumbs>
          <Typography variant="h6" color="blue-gray">
            {page}
          </Typography>
        </div>
        <div className="flex items-center">
          <div className="mr-auto md:mr-4 md:w-56">
            <Input label={t('dashboard.search')} />
          </div>

          <Menu placement="bottom-end">
            <MenuHandler>
              {/* <Button
                variant="text"
                color="blue-gray"
                className="hidden items-center gap-2 px-3 xl:flex normal-case"
              >
                {currentLangLabel}
              </Button> */}
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuItem
                onClick={() => setLang('en')}
                className={lang === 'en' ? 'font-semibold text-sebna-navy' : ''}
              >
                {t('admin.language.english')}
              </MenuItem>
              {/* <MenuItem
                onClick={() => setLang('am')}
                className={lang === 'am' ? 'font-semibold text-sebna-navy' : ''}
              >
                {t('admin.language.amharic')}
              </MenuItem>
              <MenuItem
                onClick={() => setLang('ti')}
                className={lang === 'ti' ? 'font-semibold text-sebna-navy' : ''}
              >
                {t('admin.language.tigrinya')}
              </MenuItem> */}
            </MenuList>
          </Menu>

          <Menu placement="bottom-end">
            <MenuHandler>
              <IconButton variant="text" color="blue-gray" className="grid xl:hidden">
                <span className="text-xs font-semibold text-sebna-navy">{currentLangLabel}</span>
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuItem
                onClick={() => setLang('en')}
                className={lang === 'en' ? 'font-semibold text-sebna-navy' : ''}
              >
                {t('admin.language.english')}
              </MenuItem>
              <MenuItem
                onClick={() => setLang('am')}
                className={lang === 'am' ? 'font-semibold text-sebna-navy' : ''}
              >
                {t('admin.language.amharic')}
              </MenuItem>
              <MenuItem
                onClick={() => setLang('ti')}
                className={lang === 'ti' ? 'font-semibold text-sebna-navy' : ''}
              >
                {t('admin.language.tigrinya')}
              </MenuItem>
            </MenuList>
          </Menu>

          <IconButton
            variant="text"
            color="blue-gray"
            className="grid xl:hidden"
            onClick={() => setOpenSidenav(dispatch, !openSidenav)}
          >
            <Bars3Icon strokeWidth={3} className="h-6 w-6 text-sebna-navy" />
          </IconButton>
          <Link to="/auth/sign-in">
            <Button
              variant="text"
              color="blue-gray"
              className="hidden items-center gap-1 px-4 xl:flex normal-case"
            >
              <UserCircleIcon className="h-5 w-5 text-sebna-navy" />
              {t('dashboard.signIn')}
            </Button>
            <IconButton
              variant="text"
              color="blue-gray"
              className="grid xl:hidden"
            >
              <UserCircleIcon className="h-5 w-5 text-sebna-navy" />
            </IconButton>
          </Link>
          <Menu>
            <MenuHandler>
              <IconButton variant="text" color="blue-gray">
                <BellIcon className="h-5 w-5 text-sebna-navy" />
              </IconButton>
            </MenuHandler>
            <MenuList className="w-max border-0">
              <MenuItem className="flex items-center gap-3">
                <Avatar
                  src={brandLogo}
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New message</strong> from Laur
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 13 minutes ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <Avatar
                  src={brandLogo}
                  alt="item-1"
                  size="sm"
                  variant="circular"
                />
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    <strong>New album</strong> by Travis Scott
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 1 day ago
                  </Typography>
                </div>
              </MenuItem>
              <MenuItem className="flex items-center gap-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                  <CreditCardIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-1 font-normal"
                  >
                    Payment successfully completed
                  </Typography>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="flex items-center gap-1 text-xs font-normal opacity-60"
                  >
                    <ClockIcon className="h-3.5 w-3.5" /> 2 days ago
                  </Typography>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setOpenConfigurator(dispatch, true)}
          >
            <Cog6ToothIcon className="h-5 w-5 text-sebna-navy" />
          </IconButton>
        </div>
      </div>
    </Navbar>
  );
}

DashboardNavbar.displayName = "/src/widgets/layout/dashboard-navbar.jsx";

export default DashboardNavbar;
