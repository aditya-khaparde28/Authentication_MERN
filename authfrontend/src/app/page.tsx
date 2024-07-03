import Image from "next/image";
import styles from "./page.module.css";
import Navbar from "@/Components/Navbar/Navbar";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
    <main className={styles.main}>
    <Navbar />
  </main>
  );
}
