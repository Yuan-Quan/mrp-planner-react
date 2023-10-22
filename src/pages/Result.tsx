import { Box, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { CalculateMrpChainOfProduct } from "../components/MrpCalculator"

export const Result = () => {
    return (
        <Box>
            <Typography>result:</Typography>
            <CalculateMrpChainOfProduct product_idx={0} />
        </Box>
    )
}   