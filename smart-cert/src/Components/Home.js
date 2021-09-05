import React, {useEffect, useState} from 'react';
import { 
    Container,
    Row,
    Col,
    Card,
    Button
} from 'react-bootstrap';

const Home = (props) => {

    const [positiveNumber, setPositiveNumber] = useState(0);
    const [negativeNumber, setNegativeNumber] = useState(0);
    const [totalDeclaration, setTotalDeclaration] = useState(0);

    useEffect(() => {
        async function getDeclarationData() {
            setPositiveNumber(await window.contract.getPositiveNumber());
            setNegativeNumber(await window.contract.getNegativeNumber());
            setTotalDeclaration(await window.contract.getTotalDeclaration());
            await window.contract.getListDeclaration();
        }
        getDeclarationData();
    }, []);

    return (
            <Container>
                <Row>
                    <Col className='justify-content-center d-flex'>
                        <Container>
                            <Row style={{ marginTop: '5vh' }}>
                                  <Card border="success" style={{ 
                                      width: '18rem',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      padding: '3vw'
                                      }}>
                                    <Card.Header style={{ display: 'flex', justifyContent: 'center' }}>Negative</Card.Header>
                                    <Card.Body>
                                        <Card.Text style={{ display: 'flex', justifyContent: 'center' }}>
                                            {negativeNumber}/{totalDeclaration}
                                      </Card.Text>
                                    </Card.Body>
                                  </Card>
                                  <br />
                            </Row>
                        </Container>
                    </Col>
                    <Col className='justify-content-center d-flex'>
                        <Container>
                            <Row style={{ marginTop: '5vh' }}>
                                  <Card border="danger" style={{ 
                                      width: '18rem',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      padding: '3vw'
                                      }}>
                                    <Card.Header style={{ display: 'flex', justifyContent: 'center' }}>Positive</Card.Header>
                                    <Card.Body>
                                        <Card.Text style={{ display: 'flex', justifyContent: 'center' }}>
                                          {positiveNumber}/{totalDeclaration} 
                                      </Card.Text>
                                    </Card.Body>
                                  </Card>
                                  <br />
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
    );
};

export default Home;
