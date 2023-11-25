import * as Bootstrap from "react-bootstrap";
import MainNavbar from "$/comps/MainNavbar.jsx";
import LimanaFooter from "$/comps/LimanaFooter.jsx";
import {useAccount} from "$/comps/AccountContext.jsx";
import {useEffect} from "react";

export default function ManagerView({children}) {
    const {sessionToken, userData, refreshUserData} = useAccount()

    return (
        <>
            <Bootstrap.Container className='vh-100 d-flex flex-column justify-content-between' fluid>
                <Bootstrap.Row className='justify-content-center align-items-center'>
                    <Bootstrap.Col className='text-center'>
                        <MainNavbar/>
                    </Bootstrap.Col>
                </Bootstrap.Row>

                {
                    sessionToken && userData?.userrole === 'admin' ? (
                        <>
                            {children}
                        </>
                    ) : (
                        <Bootstrap.Row className='justify-content-center align-items-center flex-grow-1'>
                            <Bootstrap.Col className='text-center'>
                                <h1 className='display-1'>Collection</h1>
                                <h2 className='display-6'>Coming Soon</h2>
                            </Bootstrap.Col>
                        </Bootstrap.Row>
                    )
                }

                <Bootstrap.Row className='justify-content-center align-items-center'>
                    <Bootstrap.Col className='text-center'>
                        <LimanaFooter/>
                    </Bootstrap.Col>
                </Bootstrap.Row>
            </Bootstrap.Container>
        </>
    )
}