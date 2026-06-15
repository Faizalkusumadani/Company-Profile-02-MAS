"use client";
import Image from "next/image";
import {
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaPhoneAlt,
  FaRegClock,
} from "react-icons/fa";
import { IoMail, IoLocationSharp } from "react-icons/io5";

export default function Footer() {
  return (
    <footer className="bg-[#110A14] pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-6 md:flex md:justify-between">
        {/* CONNECT WITH US */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold mb-6 text-red-700">
            CONNECT WITH US
          </h3>
          <Image
            src="/Logo mas.png"
            width={240}
            height={70}
            alt="Logo PT Mega Adhitama Sejati"
            className="object-contain mb-8"
            loading="eager"
            style={{ width: "240px", height: "auto" }}
          />
          {/* Social Icons */}
          <div className="flex items-center gap-6 text-4xl text-white">
            <a
              href="#"
              aria-label="Instagram PT Mega Adhitama Sejati"
              className="hover:text-gray-300 transition-colors"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              aria-label="LinkedIn PT Mega Adhitama Sejati"
              className="hover:text-gray-300 transition-colors"
            >
              <FaLinkedin />
            </a>
            <a
              href="#"
              aria-label="YouTube PT Mega Adhitama Sejati"
              className="hover:text-gray-300 transition-colors"
            >
              <FaYoutube />
            </a>
          </div>
        </div>

        {/* HEAD OFFICE */}
        <div className="mt-12 md:mt-0">
          <h3 className="text-lg sm:text-xl font-bold mb-6 text-red-700">
            HEAD OFFICE
          </h3>
          <address className="not-italic space-y-4 text-base text-white">
            <p className="flex items-start gap-3">
              <IoLocationSharp
                className="text-xl mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <span>
                Grand Puri Niaga Blok K6 No. 5S <br />
                JI. Puri Kencana, Kembangan Jakarta 11610
              </span>
            </p>

            <p className="flex items-center gap-3">
              <FaPhoneAlt className="text-xl shrink-0" aria-hidden="true" />
              <a
                href="tel:+622158351648"
                className="hover:text-gray-300 transition-colors"
              >
                +62 21 5835 1648
              </a>
            </p>

            <p className="flex items-center gap-3">
              <IoMail className="text-xl shrink-0" aria-hidden="true" />
              <a
                href="mailto:sales@megaadhitamasejati.id"
                className="hover:text-gray-300 transition-colors"
              >
                sales@megaadhitamasejati.id
              </a>
            </p>

            <p className="flex items-center gap-3">
              <FaRegClock className="text-xl shrink-0" aria-hidden="true" />
              <span>Senin–Jumat : 08.00 – 16.30 WIB</span>
            </p>
          </address>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-14 pt-4 text-white text-center text-sm">
        <span className="inline-flex items-center justify-center gap-2 flex-wrap">
          © 2025 PT Mega Adhitama Sejati. All Rights Reserved | Member of
          <a
            href="https://www.reddmasgroup.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reddmas Group (opens in new tab)"
          >
            <Image
              src="/logo_reddmas.png"
              width={80}
              height={24}
              alt="Reddmas Group"
              className="object-contain inline-block align-middle"
              loading="eager"
              style={{ height: "auto" }}
            />
          </a>
        </span>
      </div>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/628xxx"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 shadow-xl hover:bg-green-600 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi kami via WhatsApp"
      >
        <Image
          src="/whatsapp.svg"
          width={32}
          height={32}
          alt=""
          aria-hidden="true"
          className="w-8 h-8"
        />

        {/* Ping dot */}
        <span className="absolute  -top-2 -right-2 w-6 h-6 text-xs font-bold text-white bg-red-600 rounded-full flex items-center justify-center">
          1
        </span>
      </a>
    </footer>
  );
}
