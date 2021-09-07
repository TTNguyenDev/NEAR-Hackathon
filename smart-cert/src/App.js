import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import './global.css'

import UnverifyCert from './Components/UnverifyCert';
import CreateCertificate from './Components/CreateCertificate';
import AddIssuersComponent from './Components/AddIssuersComponent';
import ReadyDeployCert from './Components/ReadyDeployCert';

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
                    {window.location.href.includes("Admin") ? (
                        <Nav>
                            <Nav.Link href='/Admin/addIssuer'>New Issuer</Nav.Link>
                            <Nav.Link href='/Admin/newCert'>New Cert</Nav.Link>
                            <Nav.Link href='/Admin/deployCert'>Deploy Cert</Nav.Link>
                            <Nav.Link >Finalize</Nav.Link>
                            <Nav.Link onClick={window.accountId === '' ? login : logout}>{window.accountId === '' ? 'Login' : window.accountId}</Nav.Link>
                        </Nav>
                    ) : (
                        <Nav>
                            <Nav.Link href='/unverifyCert'>Incoming Cert</Nav.Link>
                            <Nav.Link href='/finalizedCert'>My Cert</Nav.Link>
                            <Nav.Link onClick={window.accountId === '' ? login : logout}>{window.accountId === '' ? 'Login' : window.accountId}</Nav.Link>
                        </Nav>
                    )}
              </Navbar.Collapse>
              </Container>
            </Navbar>

            <Switch>
                {/* <Route exact path='/'> */}
                {/*     <Home/> */} 
                {/* </Route> */}   
                {/*Admin Route */}
                <Route exact path='/Admin/addIssuer'>
                    <AddIssuersComponent/>
                </Route>    
                <Route exact path='/Admin/newCert'>
                    <CreateCertificate/>
                </Route>
                <Route exact path='/Admin/deployCert'>
                    <ReadyDeployCert/>
                </Route>

                {/*User Route*/}
                <Route exact path='/unverifyCert'>
                    <UnverifyCert/>
                </Route>    
                <Route exact path='/finalizedCert'>
                    <CreateCertificate/>
                </Route>
                <Route exact path='/checkCert'>
                    <ReadyDeployCert/>
                </Route>
            </Switch>
        </Router>
    ); 
}
