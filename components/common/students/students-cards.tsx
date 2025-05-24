"use client";

import {
  Text,
  Page,
  View,
  Image,
  Document,
  StyleSheet,
  PageProps,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";
import { Student } from "@/types/Student";
import React from "react";
import QRCode from "qrcode";
import CryptoJS from "crypto-js";

Font.register({
  family: "Lato",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/lato/v16/S6uyw4BMUTPHjx4wWw.ttf",
      fontWeight: "normal",
    },
    {
      src: "https://fonts.gstatic.com/s/lato/v16/S6u8w4BMUTPHjxsAXC-v.ttf",
      fontStyle: "italic",
    },
    {
      src: "https://fonts.gstatic.com/s/lato/v16/S6u9w4BMUTPHh6UVSwiPHA.ttf",
      fontWeight: "bold",
    },
  ],
});

const SECRET_KEY = process.env.AUTH_SECRET_KEY || "";

const studentStyles = StyleSheet.create({
  page: {
    fontFamily: "Lato",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  card: {
    width: "400px",
    border: "1px solid #000",
    borderRadius: 10,
    padding: 20,
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
});

export const generateSessionPDFQrCode = async ({
  student,
}: {
  student: Student;
}): Promise<string> => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify({
      id: student.id,
      name: student.name,
      birth_date: student.birth_date,
      class: {
        index: student.class?.index,
        name: student.class?.name,
      },
    }),
    SECRET_KEY
  ).toString();

  return await QRCode.toDataURL(encryptedData, {
    errorCorrectionLevel: "H",
  });
};

const StudentCard = ({
  student,
  ...props
}: {
  student: Student;
} & PageProps) => {
  const QRCode = generateSessionPDFQrCode({ student });

  return (
    <Page {...props} style={studentStyles.page}>
      <View style={studentStyles.container}>
        <View style={studentStyles.card}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image style={{ width: 120 }} src={QRCode} />
          <View style={{ flexDirection: "column", gap: 10, padding: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {student.name}
            </Text>
            <Text style={{ fontSize: 16 }}>
              {student.birth_date.toString()}
            </Text>
            <Text style={{ fontSize: 16 }}>Nº de Matrícula: {student.id}</Text>
          </View>
        </View>
      </View>
    </Page>
  );
};

const StudentsCards = ({ students }: { students: Student[] }) => {
  return (
    <PDFViewer className="w-full h-screen">
      <Document
        author="Projeto Integrador 3"
        keywords="carteirinhas"
        subject="Carteirinhas"
        title="Carteirinhas"
      >
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </Document>
    </PDFViewer>
  );
};

export default StudentsCards;
