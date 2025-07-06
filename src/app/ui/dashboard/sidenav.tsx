import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';
import styles from "./ui_dashboard.module.css";
// import { signOut } from "../../../../auth"

export default function SideNav() {
  // const { data: session } = useSession();

    return (
      <div className={styles.sidenavContainer}>
        <Link
          className={styles.link}
          href="/"
        >
          <div className={styles.logo}>
            <h3>Number Crunching AI</h3>
          </div>
        </Link>
        <div className={styles.navlinksContainer}>
          <NavLinks />
          <div className={styles.formContainer}></div>
          <form
            // action={async () =>{
            //   'use server'
            //  session ? signOut(session?.)

            // }}
            >
            <button className={styles.button}>
              <PowerIcon className={styles.powerIcon} />
              <div className={styles.signOutDiv}>Sign Out</div>
            </button>
          </form>
        </div>
      </div>
    );
  }
  