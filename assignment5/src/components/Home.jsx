import { Image } from 'react-bootstrap';

function Home() {
  return (
    <>
      <center>
        <p>This is my super cool TODO App. You can use it to track any super short term TODO items</p>
        <Image src="/todo_note.png" alt="" width={350} fluid />
      </center>
    </>
  );
}

export default Home;