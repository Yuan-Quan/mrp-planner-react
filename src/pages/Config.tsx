import { Box } from "@mui/material"
import ConfigStepper from "../components/configPage/ConfigStepper"
import { Outlet } from "react-router-dom"

export const ConfigPage = () => {
    return (
        <Box>
            <ConfigStepper />
            <Outlet />
        </Box>
    )
}