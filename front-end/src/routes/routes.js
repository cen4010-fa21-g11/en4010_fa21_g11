import './../main.css';
import { useState } from 'react';
import HomePage from './homepage/homepage';
import SignUpPage from './signup/signup';
import LoginPage from './login/login';
import PostsPage from './posts/posts';
import CreatePostPage from './createpost/createpost';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

function Router() {

  const [userInfo, changeUserInfo] = useState({ verified: false });

  function userLoggedIn() {
    return userInfo && userInfo.verified;
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/~cen4010_fa21_g11/project/signup" render={() => <SignUpPage user={userInfo} loginUser={changeUserInfo} />} />
        <Route path="/~cen4010_fa21_g11/project/login" render={() => <LoginPage user={userInfo} loginUser={changeUserInfo} />} />
        <Route path="/~cen4010_fa21_g11/project/posts" render={() => {
          if (userLoggedIn()) {
            return <PostsPage user={userInfo} />
          }
          return <Redirect to="/~cen4010_fa21_g11/project/login" />
        }} />
        <Route path="/~cen4010_fa21_g11/project/createpost" render={() => {
          if (userLoggedIn()) {
            return <CreatePostPage user={userInfo} />
          }
          return <Redirect to="/~cen4010_fa21_g11/project/login" />
        }} />
        <Route path="/~cen4010_fa21_g11/project/" render={() => <HomePage user={userInfo} />} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
