import * as React from 'react';
import { Box, List, Typography } from "@mui/material"
import { AppContext } from "../App"
import { InitStateProductItem } from '../components/configPage/InitStateProductItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IProduct } from '../MrpData';

interface IRow {
    name: string;
    initialStock: number;
    leadTime: number;
    dependencis: string;
    targetPeriode?: number;
    targetStock?: number;
}



const InfoTable = () => {
    const { targetProducts, setTargetProducts, normalProducts, setNormalProducts } = React.useContext(AppContext)
    const findProductByIdx = (idx: number) => {
        return [...targetProducts, ...normalProducts].find((product) => product.idx == idx)
    }
    const createData = (props: IProduct) => {
        return {
            name: props.name,
            initialStock: props.inital_stock,
            leadTime: props.lead_time,
            dependencis: props.dependencis.map((dep) => {
                return findProductByIdx(dep.deps_idx)?.name + " * " + dep.ratio
            }).join(", "),
            targetPeriod: props.target_periode,
            targetStock: props.target_stock
        }
    }
    const rows = [...targetProducts.map((product) => createData(product)), ...normalProducts.map((product) => createData(product))]
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>产品名称</TableCell>
                        <TableCell align="right">初始库存</TableCell>
                        <TableCell align="right">提前期&nbsp;(periods)</TableCell>
                        <TableCell align="right">依赖项目&nbsp;</TableCell>
                        <TableCell align="right">目标周期&nbsp;(periods)</TableCell>
                        <TableCell align="right">目标库存&nbsp;(periods)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.initialStock}</TableCell>
                            <TableCell align="right">{row.leadTime}</TableCell>
                            <TableCell align="right">{row.dependencis}</TableCell>
                            <TableCell align="right">{row.targetPeriod}</TableCell>
                            <TableCell align="right">{row.targetStock}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export const ConfigConfrim = () => {
    return (
        <Box>
            <Typography variant="h1">确认您的设置</Typography>
            <InfoTable />
        </Box>
    )
}