import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Section, Shelf } from '../types/store';

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

interface SectionViewProps {
  section: Section;
  onShelfClick: (shelf: Shelf) => void;
  onBack: () => void;
}

export const SectionView: React.FC<SectionViewProps> = ({ section, onShelfClick, onBack }) => {
  return (
    <Paper elevation={3} sx={{ p: 2, width: '800px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">{section.name}</Typography>
        <Button variant="contained" onClick={onBack}>
          Back to Store
        </Button>
      </Box>
      <GridContainer>
        {section.shelves.map((shelf) => (
          <GridItem key={shelf.id}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
              onClick={() => onShelfClick(shelf)}
            >
              <Typography variant="h6">{shelf.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {shelf.products.length} products
              </Typography>
            </Paper>
          </GridItem>
        ))}
      </GridContainer>
    </Paper>
  );
}; 