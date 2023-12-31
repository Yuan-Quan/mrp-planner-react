import * as React from 'react';
import { ListItem, ListItemButton, ListItemText, TextField, Typography } from "@mui/material"
import { IProduct } from "../../MrpData"
import { AppContext } from "../../App"

export const DepsProductItem = (props: IProduct) => {
    const { normalProducts, setNormalProducts, targetProducts, setTargetProducts } = React.useContext(AppContext)

    const handleNameChange = (e: any) => {
        const newNormalProducts = normalProducts.map((product) => {
            if (product.idx == props.idx) {
                return { ...product, name: e.target.value }
            }
            else {
                return product
            }
        });
        setNormalProducts(newNormalProducts);
    }

    const handleLeadTimeChange = (e: any) => {
        const newTargetProducts = targetProducts.map((product) => {
            if (product.idx == props.idx) {
                return { ...product, lead_time: parseInt(e.target.value) }
            }
            else {
                return product
            }
        });
        setTargetProducts(newTargetProducts);

        const newNormalProducts = normalProducts.map((product) => {
            if (product.idx == props.idx) {
                return { ...product, lead_time: parseInt(e.target.value) }
            }
            else {
                return product
            }
        });
        setNormalProducts(newNormalProducts);
    }

    const handleMinimumOrderQuantityChange = (e: any) => {
        const newTargetProducts = targetProducts.map((product) => {
            if (product.idx == props.idx) {
                return { ...product, minimal_order_quantity: parseInt(e.target.value) }
            }
            else {
                return product
            }
        });
        setTargetProducts(newTargetProducts);

        const newNormalProducts = normalProducts.map((product) => {
            if (product.idx == props.idx) {
                return { ...product, minimal_order_quantity: parseInt(e.target.value) }
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
    }, [normalProducts])

    return (
        <ListItem disablePadding>
            <ListItemButton>
                <TextField id="standard-basic" label="产品名称*" variant="standard" onChange={handleNameChange} defaultValue={props.name} />
                <TextField
                    id="target-periode"
                    label="提前期*"
                    type="number"
                    defaultValue={props.lead_time}
                    onChange={handleLeadTimeChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    label="订单批量*"
                    type="number"
                    defaultValue={props.minimal_order_quantity}
                    onChange={handleMinimumOrderQuantityChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </ListItemButton>
        </ListItem>
    )
}