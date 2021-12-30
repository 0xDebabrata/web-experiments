import Head from 'next/head'
import Image from 'next/image'
import { useState } from "react"
import Chat from "../components/Chat"
import Settings from "../components/Settings"
import styles from '../styles/Home.module.css'
import { tabs } from "../components/Tabs"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {

    const [selectedTab, setSelectedTab] = useState(tabs[0])

  return (
    <div className={styles.container}>
      <nav>
        <ul>
            {tabs.map((item, index) => {
                return (
                    <li
                        onClick={() => setSelectedTab(item)}
                        key={index}>
                        <p>{item}</p>

                        {selectedTab === item ? (
                            <motion.div className="selected" layoutId="selected" />
                        ) : null}
                    </li>
                )
            })}
        </ul>
      </nav>
      <main>
        <AnimatePresence exitBeforeEnter>
            <motion.div
                key={selectedTab}
                animate={{opacity: 1, x: 0}}
                initial={{opacity: 0, x: -20}}
                exit={{opacity: 0, x: 20}}
                transition={{duration: 0.15}}
            >
                {selectedTab === "chat" ? <Chat /> : <Settings />}
            </motion.div>                
        </AnimatePresence>
      </main>
    </div>
  )
}
