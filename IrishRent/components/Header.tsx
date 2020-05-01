import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Container from "react-bootstrap/Container";
import styles from "./Header.module.css";

export default function Header() {
	return (
		<Navbar className={styles.header} expand="md" variant='dark'>
			<Container>
				<Navbar.Brand href="#home">Irish Rent</Navbar.Brand>
				<Form inline className={styles.navSearchForm}>
					<FormControl
						type="text"
						placeholder="Search"
						className={styles.navSearchInput}
					/>
				</Form>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="ml-auto">
						<Nav.Link href="#link" className="text-light">Contact</Nav.Link>
						<Nav.Link href="#link" className="text-light">Log In</Nav.Link>
						<Nav.Link href="#link" className="text-light">Register</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
