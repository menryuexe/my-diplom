import React from 'react';
import { Box, Paper, Typography, Button, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Shelf } from '../types/store';

const GridContainer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: 'repeat(12, 1fr)',
  gap: '16px',
  padding: '16px',
});

const GridItem = styled(Box)(({ theme }) => ({
  gridColumn: 'span 12',
  [theme.breakpoints.up('sm')]: {
    gridColumn: 'span 6',
  },
  [theme.breakpoints.up('md')]: {
    gridColumn: 'span 4',
  },
}));

interface ShelfViewProps {
  shelf: Shelf;
  onBack: () => void;
}

export const ShelfView: React.FC<ShelfViewProps> = ({ shelf, onBack }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, width: '800px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{shelf.name}</Typography>
        <Button variant="contained" onClick={onBack}>
          Назад до секції
        </Button>
      </Box>
      <GridContainer>
        {shelf.products.map((product) => (
          <GridItem key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ${product.price}
                </Typography>
              </CardContent>
            </Card>
          </GridItem>
        ))}
      </GridContainer>
    </Paper>
  );
}; 