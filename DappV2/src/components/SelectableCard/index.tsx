import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
import makeStyles from '@mui/styles/makeStyles';

import Box from '@mui/material/Box';
import {Card, CardActionArea, CardContent, Typography} from '@mui/material';

const useStyles = makeStyles({
  root: {
    maxWidth: 345
  }
});

export default function ImgMediaCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            CardActionsArea Example
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            This CardContent is wrapped in a CardActionsArea, so this text and
            the above header are wrapped in a ButtonBase, which means they
            behave like a Button.
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

