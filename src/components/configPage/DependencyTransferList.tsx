import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { IProduct } from '../../MrpData';
import { AppContext } from '../../App';
import { TextField, Typography } from '@mui/material';

function not(a: readonly number[], b: readonly number[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly number[], b: readonly number[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export default function DepsTransferList(props: IProduct) {
    const { targetProducts, normalProducts, setTargetProducts, setNormalProducts } = React.useContext(AppContext)
    const [checked, setChecked] = React.useState<readonly number[]>([]);
    const [left, setLeft] = React.useState<readonly number[]>(props.dependencies.map((deps) => deps.deps_idx));
    const [right, setRight] = React.useState<readonly number[]>(normalProducts.map((product) => product.idx).filter((idx) => !props.dependencies.map((deps) => deps.deps_idx).includes(idx)));

    // set deps
    React.useEffect(() => {
        // if curent props is a product in targetProducts
        if (targetProducts.map((product) => product.idx).includes(props.idx)) {
            const newTargetProducts = targetProducts.map((product) => {
                if (product.idx == props.idx) {
                    left.map((left_idx) => {
                        // if its already in the deps, do nothing, only when its not in the deps, add it
                        if (!product.dependencies.map((deps) => deps.deps_idx).includes(left_idx)) {
                            product.dependencies.push({
                                deps_idx: left_idx,
                                ratio: 1
                            })
                        }
                    })
                    return product
                }
                else {
                    return product
                }
            });
            setTargetProducts(newTargetProducts);
        }
        else { // else it must be a product in normalProducts
            const newNormalProducts = normalProducts.map((product) => {
                if (product.idx == props.idx) {
                    left.map((left_idx) => {
                        if (!product.dependencies.map((deps) => deps.deps_idx).includes(left_idx)) {
                            product.dependencies.push({
                                deps_idx: left_idx,
                                ratio: 1
                            })
                        }
                    })
                    return product
                }
                else {
                    return product
                }
            });
            setNormalProducts(newNormalProducts);
        }
    }, [left])

    // set deps
    React.useEffect(() => {
        // if curent props is a product in targetProducts
        if (targetProducts.map((product) => product.idx).includes(props.idx)) {
            const newTargetProducts = targetProducts.map((product) => {
                if (product.idx == props.idx) {
                    right.map((right_idx) => {
                        // if it exist in the deps, remove it
                        if (product.dependencies.map((deps) => deps.deps_idx).includes(right_idx)) {
                            product.dependencies = product.dependencies.filter((deps) => deps.deps_idx != right_idx)
                        }
                    })
                    return product
                }
                else {
                    return product
                }
            });
            setTargetProducts(newTargetProducts);
        }
        else { // else it must be a product in normalProducts
            const newNormalProducts = normalProducts.map((product) => {
                if (product.idx == props.idx) {
                    right.map((right_idx) => {
                        // if it exist in the deps, remove it
                        if (product.dependencies.map((deps) => deps.deps_idx).includes(right_idx)) {
                            product.dependencies = product.dependencies.filter((deps) => deps.deps_idx != right_idx)
                        }
                    })
                    return product
                }
                else {
                    return product
                }
            });
            setNormalProducts(newNormalProducts);
        }
    }, [right])

    // set deps ratio
    const handleRatioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
        const newTargetProducts = targetProducts.map((product) => {
            if (product.idx == props.idx) {
                product.dependencies = product.dependencies.map((deps) => {
                    if (deps.deps_idx == idx) {
                        return { ...deps, ratio: parseInt(e.target.value) }
                    }
                    else {
                        return deps
                    }
                })
                return product
            }
            else {
                return product
            }
        });
        setTargetProducts(newTargetProducts);

        const newNormalProducts = normalProducts.map((product) => {
            if (product.idx == props.idx) {
                product.dependencies = product.dependencies.map((deps) => {
                    if (deps.deps_idx == idx) {
                        return { ...deps, ratio: parseInt(e.target.value) }
                    }
                    else {
                        return deps
                    }
                })
                return product
            }
            else {
                return product
            }
        });
        setNormalProducts(newNormalProducts);

        console.log(targetProducts);
        console.log(normalProducts);
    }

    // persist to localStorage
    React.useEffect(() => {
        localStorage.setItem("targetProducts", JSON.stringify(targetProducts))
        localStorage.setItem("normalProducts", JSON.stringify(normalProducts))
    }, [targetProducts, normalProducts])

    const findProductByIdx = (idx: number) => {
        return [...targetProducts, ...normalProducts].find((product) => product.idx == idx)
    }

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const handleAllRight = () => {
        setRight(right.concat(left));
        setLeft([]);
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const handleAllLeft = () => {
        setLeft(left.concat(right));
        setRight([]);
    };

    const getDepsRatio = (deps_idx: number) => {
        return props.dependencies.find((deps) => deps.deps_idx == deps_idx)?.ratio;
    }

    const customList = (items: readonly number[]) => (
        <Paper sx={{ width: 400, height: 230, overflow: 'auto' }}>
            <List dense component="div" role="list">
                {items.map((value: number) => {
                    const labelId = `transfer-list-item-${value}-label`;

                    return (
                        <ListItem
                            key={value}
                            role="listitem"
                            button
                            onClick={handleToggle(value)}
                        >
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={findProductByIdx(value)?.name} />
                            <TextField id="standard-basic" label="倍率*" variant="standard" defaultValue={getDepsRatio(value)} onChange={(e) => handleRatioChange(e, value)} />
                        </ListItem>
                    );
                })}
            </List>
        </Paper>
    );

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Typography variant="h1">{props.name}的依赖项目</Typography>
            <Grid item>{customList(left)}</Grid>
            <Grid item>
                <Grid container direction="column" alignItems="center">
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllRight}
                        disabled={left.length === 0}
                        aria-label="move all right"
                    >
                        ≫
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                    >
                        &gt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                    >
                        &lt;
                    </Button>
                    <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleAllLeft}
                        disabled={right.length === 0}
                        aria-label="move all left"
                    >
                        ≪
                    </Button>
                </Grid>
            </Grid>
            <Grid item>{customList(right)}</Grid>
        </Grid>
    );
}