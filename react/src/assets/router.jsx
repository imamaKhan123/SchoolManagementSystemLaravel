import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Signup from './views/Signup';
import NotFound from './views/NotFound';
import GuestLayout from '../components/GuestLayout';
import DefaultLayout from '../components/DefaultLayout'; // Ensure this is correctly imported
import Users from './views/Users';
import Dashboard from './views/Dashboard';
import UserForm from './views/UserForm';
import Teachers from './views/Teachers';
import Students from './views/Students';
import StudentForm from './views/StudentForm';
import AddStudents from './views/AddStudents';
import AttendanceHistory from './views/ViewAttendence';
import MarkAttendance from './views/MarkAttendence';
import ViewClassAttendance from './views/ViewClassAttendance';
import ClassAttendance from './views/ClassAttendance';
import ShowStudentProfile from './views/ShowStudentProfile';
import FileUpload from './views/FileUpload';
import EnrollStudent from './views/EnrollStudent';
import CourseAssignments from './views/Assignments';
import Messages from './views/Messages';
import TeacherDashboard from './views/TeacherDashboard';
import GradingAssignments from './views/GradingAssignments';
import ShowTeacherProfile from './views/ShowTeacherProfile';
import ShowCourses from './views/Courses';

const router = createBrowserRouter([
  // Guest Layout routes
  {
    path: '/',
    element: <GuestLayout />,
    children: [
        {
            path: '/', // Path becomes "/users"
            element: <Navigate to="/login" />,
          },
      {
        path: 'login', // Path becomes "/login"
        element: <Login />,
      },
      {
        path: 'signup', // Path becomes "/signup"
        element: <Signup />,
      },
    ],
  },

  // Default Layout routes
  {
    path: '/', // Root path
    element: <DefaultLayout />,
    children: [
        {
            path: '/', // Path becomes "/users"
            element: <Navigate to="/users" />,
          },
      {
        path: 'users', // Path becomes "/users"
        element: <Users />,
      },
      {
        path: 'teachers', // Path becomes "/users"
        element: <Teachers />,
      }, 
      {
        path: 'students', // Path becomes "/users"
        element: <Students />,
      },
      {
        path: 'add-students', // Path becomes "/users"
        element: < AddStudents/>,
      },
      {
        path: '/student/:id', // Path becomes "/users"
        element: < StudentForm/>,
      },
      {
        path: 'mark-attendence/:studentId', // Path becomes "/users"
        element: <MarkAttendance />,
      },
      {
        path: 'view-attendence/:studentId', // Path becomes "/users"
        element: <AttendanceHistory />,
      },
      {
        path: 'mark-attendence', // Path becomes "/users"
        element: <ClassAttendance />,
      },
      {
        path: 'view-attendence', // Path becomes "/users"
        element: < ViewClassAttendance/>,
      },
      {
        path: 'dashboard', // Path becomes "/dashboard"
        element: <Dashboard />,
      },,
      {
        path: '/users/new',
        element: <UserForm key="userCreate" />
      },
      {
        path: '/users/:id',
        element: <UserForm key="userUpdate" />
      },
      {
        path: '/upload/:id',
        element: <FileUpload  />
      },
      {
        path: '/show-profile/:id',
        element: <ShowStudentProfile  />
      }, 
      {
        path: '/enroll-student/:id',
        element: <EnrollStudent  />
      },
       {
        path: '/assignment/:id',
        element: <CourseAssignments />
      },
      {
        path:"/messages" ,
        element:<Messages />

      },
      {
        path:"/teacher-dashboard" ,
        element:<TeacherDashboard />

      },
      {
        path:"/grade-assignment/:courseId" ,
        element:<GradingAssignments />

      }
      ,
      {
        path:"/show-teacher-profile/:id" ,
        element:<ShowTeacherProfile />

      },{
        path:"/show-courses/:id" ,
        element:<ShowCourses />

      }
    ],
  },

  // Fallback route for undefined paths
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
