import * as React from 'react';
import { Box, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { calculateMrpChainOfProduct } from "../components/MrpCalculator"
import ProductMrpTable from "../components/resultPage/ProductMrpTable"
import { AppContext } from '../App';

export const Result = () => {
    const { targetProducts, normalProducts, setMrpResult } = React.useContext(AppContext)

    React.useEffect(() => {
        setMrpResult(calculateMrpChainOfProduct(targetProducts, normalProducts))
    }, [])

    return (
        <Box>
            <Typography variant="h2">计算结果:</Typography>
            {/* <CalculateMrpChainOfProduct product_idx={0} /> */}
            <Box>
                {targetProducts.map((product, index) => (<ProductMrpTable {...product} />))}
                {normalProducts.map((product, index) => (<ProductMrpTable {...product} />))}
            </Box>
        </Box>
    )
}   