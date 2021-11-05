import '../../main.css';
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';

function PostsPage({ user }) {
  return (
    <div>
      <h1>Posts</h1>

      




      <Link to="/">
        <Button>
          Home
        </Button>
      </Link>
    </div>
  );
}

export default PostsPage;
