import './App.css'
import { BrowserRouter as Router, Route} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { PrivateSocketProvider } from './context/PrivateSocketContext';
import { PublicClassSocketProvider } from './context/PublicClassSocketContext';
import PrivateRoute from './utils/PrivateRoute';

import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/profiles/Profile';
import ViewPost from './pages/Posts/ViewPost';
import EditPost from './pages/Posts/EditPost';
import CreatePost from './pages/Posts/CreatePost';
import EditProfile from './pages/profiles/EditProfile';
import Feed from './pages/profiles/Feed';
import Search from './pages/Search';
import Inbox from './pages/chat/Inbox';
import Chat from './pages/chat/Chat';
import CreateClass from './pages/classes/CreateClass';
import AttendClass from './pages/classes/AttendClass';
import ViewSubscriptions from './pages/subscriptions/ViewSubscriptions';
import Appointments from './pages/appointments/Appointments';
import Transactions from './pages/transactions/Transactions';
import ResetPasswordConfirm from './pages/auth/ResetPasswordConfirm';
import Purchases from './pages/purchases/Purchases';


function App() {
  return (
    <div className="App">
      <Router>
      <ThemeProvider>
      <AuthProvider>
          <Route exact component={LoginPage} path = '/'></Route>
          <Route component={LoginPage} path='/login'></Route>
          <Route component={SignUpPage} path='/signup'></Route>
          <PrivateRoute component={EditPost} path='/post/edit/:postid' exact/>
          <PrivateRoute component={CreatePost} path='/new-post/create' exact/>
          <Route component={ViewPost} path='/post/:postid' exact></Route>
          <Route component={Profile} path='/user/:username'></Route>
          <PrivateRoute component={Profile} path='/home'/>
          <PrivateRoute component={EditProfile} path='/profile/edit'/>
          <Route component={Feed} path='/feed'></Route>
          <Route component={Search} path='/search/:Q'></Route>
          <PrivateRoute component={Appointments} path='/calendar'/>
          <PrivateRoute component={Transactions} path='/transactions'/>
          <PrivateRoute component={Inbox} path='/inbox'/>
          <PrivateSocketProvider>
            <PrivateRoute component={Chat} path='/chat/:threadid'/>
          </PrivateSocketProvider>
          <PrivateRoute component={CreateClass} path='/class/create'/>
          <PublicClassSocketProvider>
            <PrivateRoute component={AttendClass} path='/attend/class/:threadid'/>
          </PublicClassSocketProvider>
          <PrivateRoute component={ViewSubscriptions} path='/subscriptions'/>
          <PrivateRoute component={Purchases} path='/purchases'/>
          <Route exact component={ResetPassword} path='/password/reset'></Route>
          <Route exact component={ResetPasswordConfirm} path='/password/reset/confirm/:uid/:token'></Route>
      </AuthProvider>
      </ThemeProvider>
      </Router>
    </div>
  );
}

export default App;
