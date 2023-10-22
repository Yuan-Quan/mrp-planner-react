import * as React from 'react';
import { Box, List, Typography } from "@mui/material"
import { AppContext } from "../App"
import { InitStateProductItem } from '../components/configPage/InitStateProductItem';

export const ConfigInitState = () => {
    const { targetProducts, setTargetProducts, normalProducts, setNormalProducts } = React.useContext(AppContext)
    return (
        <Box>
            <Typography variant="h1">设置初始的库存状态</Typography>
            <List>
                {targetProducts.map((product, index) => (<InitStateProductItem{...product} />))}
                {normalProducts.map((product, index) => (<InitStateProductItem{...product} />))}
            </List>
        </Box>
    )
}