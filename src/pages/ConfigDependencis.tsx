import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Box, Fab, List, Typography } from "@mui/material"
import { AppContext } from '../App';
import { DepsProductItem } from '../components/configPage/DepsProductItem';
import DepsTransferList from '../components/configPage/DependencyTransferList';

export const ConfigDependencis = () => {
    const { targetProducts, normalProducts, setNormalProducts } = React.useContext(AppContext)
    const handleAddNormalProduct = () => {
        setNormalProducts([...normalProducts, {
            idx: targetProducts.length + normalProducts.length,
            name: "",
            lead_time: 1,
            dependencies: [],
            inital_stock: 0,
            minimal_order_quantity: 1,
        }])
    }
    console.log(targetProducts);
    return (
        <Box>
            <Box>
                <Typography variant="h1">设置产品依赖关系</Typography>
                <List>
                    {targetProducts.map((product, index) => (<DepsProductItem {...product} />))}
                    {normalProducts.map((product, index) => (<DepsProductItem {...product} />))}
                </List>

                <Fab color="primary" aria-label="add" onClick={handleAddNormalProduct}>
                    <AddIcon />
                </Fab>
            </Box>
            <Box>
                {targetProducts.map((product, index) => (<DepsTransferList {...product} />))}
                {normalProducts.map((product, index) => (<DepsTransferList {...product} />))}
            </Box>

        </Box>
    )
}