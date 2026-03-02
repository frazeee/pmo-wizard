import React, { forwardRef } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';

const CarNewsComponent = forwardRef(function CarNewsComponent(
  {
    CardName,
    Content,
    URL,
    buttonOn,
    component,
    to,
    buttonLabel = 'Open',
    mediaHeight,
    titleLines = 2,
    bodyLines = 3,
    cardWidth,
    ...rest
  },
  ref
) {
  return (
    <Card
      ref={ref}
      sx={{
        maxWidth: cardWidth,
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        ':hover': {
          boxShadow: 10,
        }
      }}
      {...rest}
    >
        <CardMedia
          component="img"
          height={mediaHeight}
          image={URL}
          alt={CardName || 'image'}
          sx={{
            objectFit: 'cover',
          }}
        />

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: titleLines,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
            gutterBottom
          >
            {CardName}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              display: '-webkit-box',
              WebkitLineClamp: bodyLines,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {Content}
          </Typography>
        </CardContent>

      
        {buttonOn && (
          <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 1,
            px: 2,
            pb: 2,
            minHeight: 40,
          }}
        >
            <Button
              variant="contained"
              component={component}
              to={to}
              size="small"
              sx={{
                backgroundColor: "#2e2e38",
                color: "white",
                fontWeight: 500,
                '&:hover': { backgroundColor: '#22222b' },
              }}
            >
              {buttonLabel}
            </Button>
          </Box>
        )}
      
    </Card>
  );
});

export default CarNewsComponent;