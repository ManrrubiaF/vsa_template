import Styles from './PortfolioAdmin.module.css'
import axios from 'axios'
import { useAppDispatch, useAppSelector } from '../../../Redux/Hooks'
import { setPortfolio } from '../../../Redux/Slice/PortfolioSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PortfolioAdmin(){
    const BACK_URL = process.env.REACT_APP_BACK_URL;
    const dispatch = useAppDispatch();
    const portfolioArray = useAppSelector((state)=> state.portfolio)
    const navigate = useNavigate()

    useEffect(()=>{
        getPortfolio();
    },[])

    const getPortfolio = async ()=>{
        try {
            const response = await axios.get(`${BACK_URL}/portfolio`);
            dispatch(setPortfolio(response.data));
        } catch (error) {
            console.error(error)            
        }
    }

    return(
        <div className={Styles.divMayor}>
            {portfolioArray.length > 0 ?(
                portfolioArray.map((onePic) => (
                    <div className={Styles.dataPic} key={onePic.id}>
                        <div className={Styles.detail} onClick={() => navigate(`/someplace/portfolio/detail/${onePic.id}`)}>
                            <img
                                src={onePic.links[0]}
                                alt='primera imagen'
                            />    
                            <span>{onePic.description}</span>                            
                        </div>
                    </div>
                ))
            ):(
                <div> 
                    Cargando datos
                </div>
            )}
        </div>
    )
}