import { Box, List, ListItem, Typography } from "@mui/material"
import { Link } from "react-router-dom"

export const Main = () => {
    return (
        <Box>
            <Typography variant="h4">Material Resource Planning (MRP) Calculator</Typography>
            <List>
                <ListItem>
                    <Link to="/config/target">开始设定参数</Link>
                </ListItem>
                <ListItem>
                    <Link to="/result">计算结果</Link>
                </ListItem>
                <ListItem>
                    <Link to="/clear">清除设定</Link>
                </ListItem>
            </List>
        </Box>
    )
}