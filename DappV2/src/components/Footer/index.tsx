import { Box, Container, Link, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const FooterWrapper = styled(Box)(
  ({ theme }) => `
        border-radius: 0;
        margin: ${theme.spacing(3)} 0;
`
);

function Footer() {
  return (
    <FooterWrapper>
      <Container maxWidth="lg">
        <Box
          py={3}
          display={{ xs: 'block', md: 'flex' }}
          alignItems="center"
          textAlign={{ xs: 'center', md: 'left' }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="subtitle1">
              &copy; 2022 - Zsale LaunchPad
            </Typography>
          </Box>
          <Typography sx={{ pt: { xs: 2, md: 0 } }} variant="subtitle1">
            Crafted by <Link style={{textDecoration: 'none'}} href="https://zarclays.com" target="_blank" rel="noopener noreferrer">Zarclays.com</Link>
          </Typography>

          <Typography>
            <a href="https://www.flaticon.com/free-icons/the" title="the icons">The icons created by Becris - Flaticon</a> | 

            <a href="https://www.flaticon.com/free-icons/astronaut" title="astronaut icons">Astronaut icons created by ultimatearm - Flaticon</a> |

            <a href="https://www.flaticon.com/free-icons/miscellaneous" title="miscellaneous icons">Miscellaneous icons created by photo3idea_studio - Flaticon</a>
          </Typography>
        </Box>
      </Container>
    </FooterWrapper>
  );
}

export default Footer;
