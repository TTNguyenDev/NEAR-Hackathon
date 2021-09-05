import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import './global.css'

import CreateCertificate from './Components/CreateCertificate';
import AddIssuersComponent from './Components/AddIssuersComponent';
// import Donation from './Components/Donation';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import {
    Container, 
    Navbar,
    Nav,
} from 'react-bootstrap';

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {
    return (
        <Router>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
              <Container>
                <Navbar.Brand href='/'>
                   Smart Certificate 
                </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mx-auto"></Nav>
                <Nav>
                    <Nav.Link href='/addIssuer'>New Issuer</Nav.Link>
                    <Nav.Link href='/newCert'>New Cert</Nav.Link>
                    <Nav.Link onClick={window.accountId === '' ? login : logout}>{window.accountId === '' ? 'Login' : window.accountId}</Nav.Link>
                </Nav>
              </Navbar.Collapse>
              </Container>
            </Navbar>

            <Switch>
                {/* <Route exact path='/'> */}
                {/*     <Home/> */} 
                {/* </Route> */}   
                <Route exact path='/addIssuer'>
                    <AddIssuersComponent/>
                </Route>    
                <Route exact path='/newCert'>
                    <CreateCertificate/>
                </Route>
            </Switch>
        </Router>
    ); 
}
