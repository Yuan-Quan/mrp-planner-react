import { Box, List, ListItem, Typography } from "@mui/material"
import { Link } from "react-router-dom"

export const Main = () => {
    return (
        <Box>
            <Typography variant="h1">Main page place holder</Typography>
            <List>
                <ListItem>
                    <Link to="/config/target">开始新的计算</Link>
                </ListItem>
                <ListItem>
                    <Link to="/game">计算结果</Link>
                </ListItem>
            </List>
        </Box>
    )
}