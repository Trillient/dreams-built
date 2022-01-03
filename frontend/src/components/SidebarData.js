import { AiFillHome, AiOutlineCalendar } from 'react-icons/ai';
import { RiArrowDownSFill, RiArrowUpSFill } from 'react-icons/ri';
import { MdOutlineEditCalendar, MdOutlineWorkOutline, MdBusiness, MdOutlinePeopleAlt, MdLogout } from 'react-icons/md';
import { CgProfile, CgFileDocument } from 'react-icons/cg';

export const SidebarData = [
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
    title: 'Clients',
    path: '/clients',
    icon: <MdBusiness />,
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
        title: 'Create Job',
        path: '/jobs/create',
      },
      {
        title: 'Job Parts',
        path: '/jobparts',
      },
      {
        title: 'Create Job Part',
        path: '/jobparts/create',
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
