import {
  BrowserRouter as Router,
  Routes,
  Route,
 
} from 'react-router-dom'

/* components */
import Footer from "./components/layouts/Footer"
import Navbar from "./components/layouts/Navbar"
import Container from "./components/layouts/Container"

/* pages */
import Login from "./components/pages/auth/login"
import Register from "./components/pages/auth/register"
import Home from "./components/pages/home"




function App() {
  return (
    <Router>
      <Navbar/>
      <Container>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
      </Routes>
      </Container>
      <Footer/>
    </Router>

  );
}

export default App;
