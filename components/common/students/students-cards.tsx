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
      position: student.position,
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

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    padding: 5,
  },
  card: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #168a43",
    borderRadius: 3,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 6,
    padding: 3,
  },
  schoolName: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#168a43",
  },
  idText: {
    fontSize: 6,
  },
  content: {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    marginBottom: 4,
    padding: 6,
  },
  qrSection: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    marginBottom: 4,
  },
  footer: {
    width: "100%",
    backgroundColor: "#168a43",
    height: "25px",
    borderTopRightRadius: "8px",
    borderTopLeftRadius: "8px",
    padding: "5px",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    alignItems: "center",
  },
});

const StudentCard = ({
  student,
  ...props
}: {
  student: Student;
} & PageProps) => {
  const QRCode = generateSessionPDFQrCode({ student });

  return (
    <Page {...props} size={[153.07, 242.65]} style={styles.page}>
      <View style={styles.card}>
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image
            style={{
              width: "25px",
            }}
            src="images/logo-eeaa.png"
          />
          <Text style={styles.schoolName}>E.E. ALBERTO AZEVEDO</Text>
        </View>

        <View style={styles.content}>
          <View
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              gap: 6,
              textAlign: "center",
            }}
          >
            <Text
              style={{
                fontSize: 9,
                fontWeight: "bold",
                color: "#168a43",
                paddingRight: 10,
              }}
            >
              {student.name.split("").map((char, index) => {
                return <Text key={index}>{char}</Text>;
              })}
            </Text>
            <Text style={{ fontSize: 8 }}>{student.birth_date.toString()}</Text>
            <Text style={{ fontWeight: "bold", fontSize: 8 }}>
              Nº de Matrícula:{" "}
              <Text style={{ color: "#168a43" }}>{student.id}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.qrSection}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image style={{ width: 120, height: 120 }} src={QRCode} />
        </View>

        <View style={styles.footer}>
          <View
            style={{
              borderTopRightRadius: "100%",
              borderTopLeftRadius: "100%",
              borderBottomRightRadius: "100%",
              borderBottomLeftRadius: "100%",
              width: "85%",
              height: "1.5px",
              backgroundColor: "#ffffff",
            }}
          />
          <View
            style={{
              borderTopRightRadius: "100%",
              borderTopLeftRadius: "100%",
              borderBottomRightRadius: "100%",
              borderBottomLeftRadius: "100%",
              width: "95%",
              height: "1.5px",
              backgroundColor: "#ffffff",
            }}
          />
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
