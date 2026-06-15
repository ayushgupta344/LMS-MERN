import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/student/Home'
import Courselist from './pages/student/Courselist';
import Coursedetail from './pages/student/Coursedetail';
import Myenrollment from './pages/student/Myenrollment';
import Player from './pages/student/Player';
import Educator from './pages/educator/Educator';
import Dashboard from './pages/educator/Dashboard';
import Addcourse from './pages/educator/Addcourse';
import Mycourse from './pages/educator/Mycourse';
import Studentsenrolled from './pages/educator/Studentsenrolled';
import Navbar from './components/student/navbar';

const App = () => {
  const iseducatorroute = useMatch('/educator/*')
  return (
    <div className="text-default min-h-screen bg-white">
      {!iseducatorroute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course-list" element={<Courselist />} />
        <Route path="/course/:id" element={<Coursedetail />} />
        <Route path="/my-enrollments" element={<Myenrollment />} />
        <Route path="/course-list/:input" element={<Courselist />} />
        <Route path="/player/:courseid" element={<Player />} />
        <Route path="/educator" element={<Educator />}>
          <Route path="educator" element={<Dashboard />} />
          <Route path="add-course" element={<Addcourse />} />
          <Route path="my-courses" element={<Mycourse />} />
          <Route path="student-enrolled" element={<Studentsenrolled />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App
