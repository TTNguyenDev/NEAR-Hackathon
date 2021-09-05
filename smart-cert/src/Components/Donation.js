import React, {useEffect, useState} from 'react';
import { Table, Container, Button, Row } from 'react-bootstrap';

const Donation = (props) => {
    const [listDonation, setListDonation] = useState([]);
    const [totalDonation, setTotalDonation] = useState(0);

    const onDonation = async () => {
        await window.contract.addDonation();
    }

    useEffect(() => {
        async function getBlockchainData() {
            setListDonation(await window.contract.getListDonation());
            setTotalDonation(await window.contract.getTotalDonation());
        }
        getBlockchainData();
    }, []);

    return (
        <Container>
            <div style={{ margin: '5vh' }}>
                <b>Total Donation: {convertToNear(totalDonation)} NEAR</b>
            </div>
            <Table style={{margin: '5vh'}} striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>List of Polls</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listDonation.map((el, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{el.accountId}</td>
                                    <td>
                                        {convertToNear(el.amount)}
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </Table>
            <Row >
                <Button style={{ margin: '5vh', display: 'flex', justifyContent: 'center' }} onClick={onDonation} variant='primary'>Donation</Button>
                <label style={{ margin: '1vh', display: 'flex', justifyContent: 'center' }}>Default Donation: 1 NEAR</label>
            </Row>
        </Container>
    );
    
};

function convertToNear(num) {
    return num / 10**24;
}

export default Donation;
