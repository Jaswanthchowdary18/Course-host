import { Switch, Route, Redirect } from "wouter";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import CourseDetailsPage from "@/pages/course-details-page";
import MyCoursesPage from "@/pages/my-courses-page";
import NotFound from "@/pages/not-found";

function isLoggedIn() {
  return Boolean(localStorage.getItem("user"));
}

export default function App() {
  return (
    <Switch>
      {/* Root */}
      <Route path="/">
        {isLoggedIn() ? <Redirect to="/home" /> : <Redirect to="/auth" />}
      </Route>

      {/* Auth */}
      <Route path="/auth">
        {isLoggedIn() ? <Redirect to="/home" /> : <AuthPage />}
      </Route>

      {/* Home */}
      <Route path="/home" component={HomePage} />

      {/* Protected routes */}
      <Route path="/courses/:id" component={CourseDetailsPage} />
      <Route path="/my-courses" component={MyCoursesPage} />

      <Route component={NotFound} />
    </Switch>
  );
}
