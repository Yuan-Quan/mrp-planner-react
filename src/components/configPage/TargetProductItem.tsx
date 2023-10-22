import * as React from 'react';
import { ListItem, ListItemButton, ListItemText, TextField, Typography } from "@mui/material"
import { IProduct } from "../../MrpData"
import { AppContext } from "../../App"

export const TargetProductItem = (props: IProduct) => {
    const { targetProducts, setTargetProducts } = React.useContext(AppContext)
    const handleTargetStockChange = (e: any) => {
        const newTargetProducts = targetProducts.map((product) => {
            if (product.idx == props.idx) {
                return { ...product, target_stock: parseInt(e.target.value) }
            }
            else {
                return product
            }
        });
        setTargetProducts(newTargetProducts);
    }

    const handleTargetPeriodeChange = (e: any) => {
        const newTargetProducts = targetProducts.map((product) => {
            if (product.idx == props.idx) {
                return { ...product, target_periode: parseInt(e.target.value) }
            }
            else {
                return product
            }
        });
        setTargetProducts(newTargetProducts);
    }

    const handleNameChange = (e: any) => {
        const newTargetProducts = targetProducts.map((product) => {
            if (product.idx == props.idx) {
                return { ...product, name: e.target.value }
            }
            else {
                return product
            }
        });
        setTargetProducts(newTargetProducts);
    }

    // persist to localStorage
    React.useEffect(() => {
        localStorage.setItem("targetProducts", JSON.stringify(targetProducts))
    }, [targetProducts])

    return (
        <ListItem disablePadding>
            <ListItemButton>
                <TextField id="standard-basic" label="产品名称*" variant="standard" onChange={handleNameChange} defaultValue={props.name} />
                <TextField
                    id="target-stock"
                    label="目标数量*"
                    type="number"
                    defaultValue={props.target_stock}
                    onChange={handleTargetStockChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="target-periode"
                    label="目标交期*"
                    type="number"
                    defaultValue={props.target_periode}
                    onChange={handleTargetPeriodeChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />

            </ListItemButton>
        </ListItem>
    )
}