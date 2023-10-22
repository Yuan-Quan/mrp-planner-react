import * as React from 'react';
import { ListItem, ListItemButton, ListItemText, TextField, Typography } from "@mui/material"
import { IProduct } from "../../MrpData"
import { AppContext } from "../../App"

export const InitStateProductItem = (props: IProduct) => {
    const { targetProducts, setTargetProducts, normalProducts, setNormalProducts } = React.useContext(AppContext)

    const handleInitalStockChange = (e: any) => {
        // if current props is in targetProducts
        const newTargetProducts = targetProducts.map((product) => {
            if (product.idx == props.idx) {
                return { ...product, inital_stock: parseInt(e.target.value) }
            }
            else {
                return product
            }
        });
        setTargetProducts(newTargetProducts);
        // or current props is in normalProducts
        const newNormalProducts = normalProducts.map((product) => {
            if (product.idx == props.idx) {
                return { ...product, inital_stock: parseInt(e.target.value) }
            }
            else {
                return product
            }
        });
        setNormalProducts(newNormalProducts);
    }

    // persist to localStorage
    React.useEffect(() => {
        localStorage.setItem("normalProducts", JSON.stringify(normalProducts))
        localStorage.setItem("targetProducts", JSON.stringify(targetProducts))
    }, [normalProducts, targetProducts])

    return (
        <ListItem disablePadding>
            <ListItemButton>
                <ListItemText primary={props.name} />
                <TextField
                    id="target-periode"
                    label="初始库存*"
                    type="number"
                    defaultValue={props.inital_stock}
                    onChange={handleInitalStockChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

            </ListItemButton>
        </ListItem>
    )
}