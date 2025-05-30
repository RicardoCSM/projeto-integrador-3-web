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
    width: "525px",
    height: "300px",
    border: "1px solid #000",
    flexDirection: "row",
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
          <View
            style={{
              height: "100%",
              backgroundColor: "#168a43",
              width: "80px",
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
              padding: "5px",
              display: "flex",
              flexDirection: "row",
              gap: "5px",
              alignItems: "center",
            }}
          >
            <View
              style={{
                borderTopRightRadius: "100%",
                borderTopLeftRadius: "100%",
                borderBottomRightRadius: "100%",
                borderBottomLeftRadius: "100%",
                height: "95%",
                width: "4px",
                backgroundColor: "#ffffff",
              }}
            ></View>
            <View
              style={{
                borderTopRightRadius: "100%",
                borderTopLeftRadius: "100%",
                borderBottomRightRadius: "100%",
                borderBottomLeftRadius: "100%",
                height: "85%",
                width: "4px",
                backgroundColor: "#ffffff",
              }}
            ></View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              height: "100%",
              gap: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#168a43",
              }}
            >
              ESCOLA ESTADUAL ALBERTO AZEVEDO
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
                width: "90%",
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  gap: 6,
                  padding: 10,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#168a43",
                    paddingRight: 10,
                  }}
                >
                  {student.name.split("").map((char, index) => {
                    return <Text key={index}>{char}</Text>;
                  })}
                </Text>
                <Text style={{ fontSize: 16 }}>
                  {student.birth_date.toString()}
                </Text>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  Nº de Matrícula:{" "}
                  <Text style={{ color: "#168a43" }}>{student.id}</Text>
                </Text>
              </View>
              <View>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image style={{ width: 120 }} src={QRCode} />
              </View>
            </View>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              style={{
                width: "50px",
                position: "absolute",
                bottom: "10px",
                right: "10px",
              }}
              src="images/logo-eeaa.png"
            />
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
