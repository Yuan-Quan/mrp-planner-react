import * as React from 'react';
import { Box, Fab, List, Typography } from "@mui/material"
import { useContext } from "react"
import { AppContext } from "../App"
import AddIcon from '@mui/icons-material/Add';
import { TargetProductItem } from "../components/configPage/TargetProductItem"

export const ConfigTarget = () => {
    const { targetProducts, setTargetProducts } = React.useContext(AppContext)
    const handleAddTargetProduct = () => {
        setTargetProducts([...targetProducts, {
            idx: targetProducts.length,
            name: "",
            lead_time: 0,
            dependencies: [],
            inital_stock: 0,
        }])
    }
    return (
        <Box>
            <Typography variant="h1">设置目标的产品</Typography>
            <List>
                {targetProducts.map((product, index) => (<TargetProductItem {...product} />))}
            </List>

            <Fab color="primary" aria-label="add" onClick={handleAddTargetProduct}>
                <AddIcon />
            </Fab>
        </Box>
    )
}