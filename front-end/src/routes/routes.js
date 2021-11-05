import './../main.css';
import { useState } from 'react';
import HomePage from './homepage/homepage';
import SignUpPage from './signup/signup';
import LoginPage from './login/login';
import PostsPage from './posts/posts';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

function Router() {

  const [userInfo, changeUserInfo] = useState({ verified: false });

  function userLoggedIn() {
    return userInfo && userInfo.verified;
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/signup" render={_ => <SignUpPage user={userInfo} loginUser={changeUserInfo} />} />
        <Route path="/login" render={_ => <LoginPage user={userInfo} loginUser={changeUserInfo} />} />
        <Route path="/posts" render={_ => {
          if (userLoggedIn()) {
            return <PostsPage user={userInfo} />
          }
          return <Redirect to="/login" />
        }} />
        <Route path="/" render={_ => <HomePage user={userInfo} />} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
