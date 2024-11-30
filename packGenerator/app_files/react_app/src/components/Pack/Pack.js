import React from 'react';
import "./Pack.css"

const pack = props => {
    let packs = ["TOPPS_1975.jpg", "p2.jpg", "p3.jfif", "p4.jpeg", "p5.jpeg", "p7.jpg", "p8.jpg", "p9.jpg", "p10.jpg", "p11.jpg", "p12.jpeg", "p13.jfif", "p14.jpg", "p15.png", "p16.jpg", "p17.jpg", "p18.jpg", "p19.jfif", "p20.jpg", "p21.png", "p22.jpg", "p23.jpg", "p24.jpg", "p25.jpg", "p26.jpg", "p27.jpg", "p28.jpg", "p29.jpg"];
    let cardClass = 'packstylefetching';
    if (!props.fetchingpack) {
        cardClass = 'packstyle'
    }
    return (
        <div className = "full_pack">
            <div className={cardClass}><img src={require("./" + packs[Math.floor(Math.random() * Math.floor(packs.length))])} onClick={props.handlePackClick} alt="pack_image" />
            </div>
            <p>click pack to open</p>
        </div>
    );
};
export default pack