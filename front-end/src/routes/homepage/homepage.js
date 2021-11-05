import '../../main.css';
import { Typography,Box } from '@material-ui/core';
import Logo from '../../images/logo.jpg';
import BooksImg from '../../images/books.jpg';
import UniImg from '../../images/uni2.jpg';
import LibraryImg from '../../images/library.jpg';
import NavBar from '../../componets/navbar/navbar';


function HomePage({ user }) {
  return (
    <div>
      <NavBar user={user} />
      <Box sx={{display: "flex"}}>
        <img src={Logo} alt="Lighthouse" style={{maxWidth: "10%", marginTop: 10}} />
        <Box style={{textAlign: "center", flex: 1, marginTop: 20}}>
          <Typography variant="h3" style={{fontSize: 70}}>
            Hello, and Welcome to <Typography variant="inherit" className="beacon-blue">Beacon</Typography>
          </Typography>
        </Box>
      </Box>

      <Box style={{}}>
        <Box style={{marginTop: 20, marginLeft: 200, marginRight: 200}}>
          <Typography style={{textAlign: "center", fontSize: 35}}>
            <Typography variant="inherit" className="beacon-blue">Beacon </Typography>
            is a place where students can ask questions about various courses at your school!
          </Typography>
        </Box>
      </Box>

      <Box style={{display: "flex", marginTop: 100, marginBottom: 100}}>
        <Box style={{minWidth: "32%", marginLeft: 20, maxWidth: "30%", textAlign: "center"}}>
          <img src={BooksImg} alt="books" style={{width: "100%"}} />
          <Typography variant="h4">
            No matter your course <Typography variant="inherit" className="beacon-blue">Beacon</Typography> has you covered.
          </Typography>
        </Box>
        <Box style={{maxWidth: "32%", minWidth: "30%", marginLeft: 20, textAlign: "center"}}>
          <img src={LibraryImg} alt="library" style={{width: "100%"}} />
          <Typography variant="h4">
            No matter the time or day <Typography variant="inherit" className="beacon-blue">Beacon</Typography> has you covered.
          </Typography>
        </Box>
        <Box style={{minWidth: "32%", maxWidth: "30%", marginRight: 20, marginLeft: 20, textAlign: "center"}}>
          <img src={UniImg} alt="university" style={{width: "100%"}} />
          <Typography variant="h4">
            No matter your univeristy <Typography variant="inherit" className="beacon-blue">Beacon</Typography> has you covered.
          </Typography>
        </Box>
      </Box>

    </div>
  );
}

export default HomePage;
