import Head from "next/head";

const PageHead = ({ title, description, indexed = true }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description}></meta>
    </Head>
  );
};

export default PageHead;
