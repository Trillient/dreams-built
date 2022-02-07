import { AiFillHome, AiOutlineCalendar } from 'react-icons/ai';
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri';
import { MdOutlineEditCalendar, MdOutlineWorkOutline, MdBusiness, MdOutlinePeopleAlt, MdLogout } from 'react-icons/md';
import { CgProfile, CgFileDocument } from 'react-icons/cg';

export const UnAuthenticatedSidebarData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <AiFillHome />,
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: <CgProfile />,
  },
  {
    title: 'Logout',
    icon: <MdLogout />,
  },
];

export const EmployeeSidebarData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <AiFillHome />,
  },
  {
    title: 'Timesheet',
    path: '/timesheet',
    icon: <MdOutlineEditCalendar />,
  },
  {
    title: 'Jobs',
    icon: <MdOutlineWorkOutline />,
    path: '/jobs',
  },
  {
    title: 'Schedule',
    path: '/schedule',
    icon: <AiOutlineCalendar />,
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: <CgProfile />,
  },

  {
    title: 'Logout',
    icon: <MdLogout />,
  },
];

export const AdminSidebarData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <AiFillHome />,
  },
  {
    title: 'Timesheet',
    path: '/timesheet',
    icon: <MdOutlineEditCalendar />,
  },
  {
    title: 'Companies',
    icon: <MdBusiness />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    subNav: [
      {
        title: 'Clients',
        path: '/clients',
      },
      {
        title: 'Contractors',
        path: '/contractors',
      },
    ],
  },
  {
    title: 'Jobs',
    icon: <MdOutlineWorkOutline />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    subNav: [
      {
        title: 'Job List',
        path: '/jobs',
      },
      {
        title: 'Job Parts',
        path: '/jobparts',
      },
    ],
  },
  {
    title: 'Employees',
    path: '/employees',
    icon: <MdOutlinePeopleAlt />,
  },
  {
    title: 'Schedule',
    path: '/schedule',
    icon: <AiOutlineCalendar />,
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: <CgProfile />,
  },
  {
    title: 'Reports',
    icon: <CgFileDocument />,
    iconClosed: <RiArrowDownSFill />,
    iconOpened: <RiArrowUpSFill />,
    subNav: [
      {
        title: 'Employee Timesheets',
        path: '/reports/timesheets',
      },
    ],
  },
  {
    title: 'Logout',
    icon: <MdLogout />,
  },
];
