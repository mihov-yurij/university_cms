// Renders the generated .docx from a filled-in sample so the dossier layout
// can be checked without deploying or touching the database:
//
//   npx payload run scripts/preview-doc.ts
//
// Writes profile-preview.docx into the working directory.

import { writeFileSync } from "node:fs";
import { buildProfileDocx, profileFileName } from "../lib/profileDoc";

const sample = {
  fullName: "НАВРОЗОВА ЮЛІЯ ОЛЕКСАНДРІВНА",
  department: "Морський бізнес та маркетинг",
  position:
    "Завідувачка кафедри морського бізнесу та маркетингу\nНавчально-наукового інституту морського бізнесу ОНМУ",
  degree: "Кандидат економічних наук (PhD in Economics)",
  academicTitle: "Доцент",
  orcid: "0000-0002-6106-2825",
  scopus: "57216725227",
  wos: "ABG-3239-2020",
  googleScholar: "iIse1GoAAAAJ",
  email: "yuliana.docent@gmail.com",
  bio: [
    "Зав. кафедри Юлія Наврозова — провідний науковець та експерт у сфері економіки морського транспорту, сталого розвитку «блакитної економіки», управління витратами та якістю на морському транспорті, а також впровадження міжнародних ESG-стандартів політики гендерної рівності у морській галузі.",
    "Має понад 20 років досвіду науково-педагогічної діяльності, керівництва академічними програмами, реалізації міжнародних дослідницьких проєктів та активною співпрацею з морським бізнесом.",
    "Виступає гарантом освітньо-професійної програми «Морський бізнес» спеціальності D3 «Менеджмент», відповідальним секретарем фахового наукового збірника «Розвиток методів управління та господарювання на транспорті» (з 2010 р.), заступником Голови оргкомітету Всеукраїнської конференції «Проблеми і перспективи сталого розвитку транспорту» (з 2009 р.)",
  ].join("\n\n"),
  publications: [
    {
      entry: "Теоретичні та практичні засади організації морського бізнесу: кол. монографія / за ред. д.е.н., проф. І. В. Савельєвої. Одеса: ОНМУ, 2022. 404 с. DOI: 10.31375/978-966-7716-89-9.",
    },
    {
      entry: "Галузеве підприємництво: підручник / за ред. д.е.н., проф. І. В. Савельєвої. Суми: Університетська книга, 2022. 486 с. DOI: 10.36059/978-617-521-024-6.",
    },
    {
      entry: "Hlushenkova A., Kalinin O., Navrozova Yu., Navolokina A., Shcherbyna V., Doroshenko T. Management of Strategies for Shaping the Innovative and Investment Potential of Enterprises as a Factor Ensuring Their Economic Security. Indian Journal of Information Sources and Services. 2024. Vol. 14. No 3. P. 16-22. DOI: https://doi.org/10.51983/ijiss-2024.14.3.03",
    },
    {
      entry: "Наврозова Ю.О. Методичний підхід до комплексної оцінки та просторової діагностики сталого розвитку підприємства морського транспорту. Вісник східноєвропейського університету економіки і менеджменту, Черкаси, Випуск 2 (34), 2025. DOI: https://DOI.ORG/10.58253/2078-1628-2025-2(34)-013",
    },
    {
      entry: "Olga Gonchar; Anatoliy Kholodenko; Yuliia Navrozova. Optimization of port services quality indicators. Advanced computer information technologies, ACIT 2023, WROCŁAW, POLAND, SEPTEMBER 21-23, 2023. P. 265-269. ISSN: 2770-5218. DOI: 10.1109/ACIT58437.2023.10275648",
    },
  ],
  projects: [
    {
      entry: "Міжнародний проєкт «Blue Gates» (Project Code BSB00189): \"Empowering Blue and Smart Transformation of the Black Sea Basin\" (Interreg NEXT Program, 2025 – дотепер).",
    },
    {
      entry: "Міжнародне стажування Erasmus+ Staff Mobility for Training: \"Active citizenship and inclusion of students with fewer opportunities in HEIs\", Dunarea de Jos University of Galati, Romania (03.07.2023-07.07.2023, 180 годин / 6 кредитів ECTS).",
    },
  ],
};

const buffer = await buildProfileDocx(sample);
writeFileSync("profile-preview.docx", buffer);
console.log(
  `Wrote profile-preview.docx (${buffer.length} bytes). The email attachment would be named "${profileFileName(sample)}".`,
);
