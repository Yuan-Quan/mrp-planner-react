import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IProduct } from '../../MrpData';
import { AppContext } from '../../App';

interface IRow {
    name: string;
    period: number;
    gr: number;
    stock: number;
    inbound: number;
    order: number;
}

export default function ProductMrpTable(props: IProduct) {
    const { mrpResult } = React.useContext(AppContext)

    const makeRows = () => {
        const rows: IRow[] = []
        mrpResult.map((period, index) => {
            period.items.map((item) => {
                if (item.idx == props.idx) {
                    rows.push({ name: item.name, period: index + 1, gr: item.gross_requirement, stock: item.stock, inbound: item.inbound, order: item.order })
                }
            })
        })
        return rows
    }
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>产品名称</TableCell>
                        <TableCell align="right">周期</TableCell>
                        <TableCell align="right">毛需求量</TableCell>
                        <TableCell align="right">订单入库</TableCell>
                        <TableCell align="right">订单下达</TableCell>
                        <TableCell align="right">库存</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {makeRows().map((row) => (
                        <TableRow
                            key={row.period}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.period}</TableCell>
                            <TableCell align="right">{row.gr}</TableCell>
                            <TableCell align="right">{row.inbound}</TableCell>
                            <TableCell align="right">{row.order}</TableCell>
                            <TableCell align="right">{row.stock}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}