import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Box, Fab, List, Typography } from "@mui/material"
import { AppContext } from '../App';

export const ConfigDependencis = () => {
    const { targetProducts, setTargetProducts } = React.useContext(AppContext)
    console.log(targetProducts);
    return (
        <Box>
            <Typography variant="h1">设置产品依赖关系</Typography>
            <List>
            </List>

            <Fab color="primary" aria-label="add" >
                <AddIcon />
            </Fab>
        </Box>
    )
}