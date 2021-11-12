import '../../main.css';
import { CircularProgress, Box} from '@material-ui/core';


function LoadingScreen() {
  return (
    <Box style={{textAlign: "center"}}>
      <CircularProgress size={200} />
    </Box>
  );
}


export default LoadingScreen;