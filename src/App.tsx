import { ChangeEvent, useState, useRef, useEffect } from 'react';
import { Modal, Button, Input, message, Form, Pagination, Select, Alert } from 'antd';
import usePage from "@/hooks/usePage";
import ImageList from '@/ImageList';
import useModal from "@/hooks/useModal";
import useArea from "@/hooks/useArea";
import { downloadImg, downloadZipFile, ImgBlob, ImageData, getImages } from "@/utils/index";

const { TextArea } = Input;
const { Item } = Form;
const { Option } = Select;

const COOKIE_KEY = "COOKIE_KEY";


function App() {

  const { page, pageSize, setPage, setPageSize } = usePage();


  const [isLoading, setLoading] = useState(false);

  const [total, setTotal] = useState(0);

  const [list, setList] = useState<ImageData[]>([]);

  const {
    areaData,
    areaTypeList,
    areaId,
    areaType,
    handleAreaChange,
    handleAreaTypeChange
  } = useArea();

  const [cookies, setCookie] = useState(localStorage.getItem(COOKIE_KEY) || '');

  const textEl = useRef(null);

  const [qq, setQQ] = useState("");

  const handleQQInput = (e: ChangeEvent<HTMLInputElement>) => {
    setQQ(e.target.value);
  }

  const [isModalVisible, showModal, hideModal] = useModal();
  const [isQQModalVisible, showQQModal, hideQQModal] = useModal();


  const saveContent = () => {
    if (!cookies || !cookies.trim()) {
      return message.warn("请输入Cookie!");
    }
    localStorage.setItem(COOKIE_KEY, cookies);
    message.success("设置成功!");
    hideModal();
  }

  const handleCookieInput = ({ target }: ChangeEvent<HTMLTextAreaElement>): void => {
    setCookie(target.value);
  }

  const handlePageChange = (_page: number, _pageSize: number) => {
    setPage(_page);
    setPageSize(_pageSize);
  }

  const startDownloadImage = async (list: ImageData[]) => {
    let imgList = list.map(i => i.src);
    const msg = message.loading("正在下载图片...", 0);
    const blobs = await downloadImg(imgList);
    msg();
    const blobInfo: ImgBlob[] = blobs.map((blob, idx) => ({
      blob,
      name: list[idx].id + ".jpg"
    }));

    downloadZipFile(blobInfo);
  }

  const handleDownloadAllImage = async () => {
    if (isLoading) return;
    setLoading(true);

    let page = 1;
    let _total = 0;
    const allImagesInfo: ImageData[] = [];

    const getAllImagesInfo = async () => {
      const { total, list } = await getImages(qq, areaId, page, 40);
      if (list.length) {
        _total = total;
        allImagesInfo.push(...list);
      }

      if (allImagesInfo.length < total) {
        page++;
        await getAllImagesInfo();
      }
    }

    try {
      await getAllImagesInfo();
      if (allImagesInfo.length === 0) {
        message.info("当前大区没有任何荣誉截图!");
      } else {
        await startDownloadImage(allImagesInfo);
      }
    } catch (err: any) {
      message.error(err.message);
    }

    setLoading(false);
  }

  const getData = async () => {
    if (isLoading) return;
    setLoading(true);

    try {
      const { total, list } = await getImages(qq, areaId, page, pageSize);
      if (total === 0) {
        message.info("当前大区内没有任何荣誉截图!");
      }
      setTotal(total);
      setList(list);
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      message.error(err.message);
      setLoading(false);
    }
  }

  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    if (isMounted) {
      getData();
    } else {
      setMounted(true);
    }
  }, [page, pageSize]);


  const handleQuery = () => {
    getData();
  }



  const handleDownload = () => {
    startDownloadImage(list);
  }

  return (
    <div className="wrapper">
      <div className="top-content">
        <Form labelCol={{ span: 3 }}>
          <Item label="设置Cookies">
            <div className="flex flex-center-y">
              <Button style={{ marginRight: 20 }} type="primary" onClick={() => showModal()}>设置Cookies</Button>
              <Button type="primary" onClick={() => showQQModal()}>设置QQ</Button>
            </div>
          </Item>
          <Item label="选择大区">
            <Select value={areaType} onChange={handleAreaTypeChange} style={{ width: 160 }} maxTagTextLength={5}>
              {
                areaTypeList.map(area => (
                  <Option key={area.idx} value={area.idx}>{area.name}</Option>
                ))
              }
            </Select>

            <Select value={areaId} onChange={handleAreaChange} style={{ width: 120, margin: "0 20px" }} maxTagTextLength={5}>
              {
                areaData.map(area => (
                  <Option key={area.id} value={area.id}>{area.name}</Option>
                ))
              }
            </Select>

            <Button loading={isLoading} onClick={handleQuery} type="primary">查询</Button>
          </Item>

          <Item label="操作">
            <Button type="primary" style={{ marginRight: 20 }} onClick={handleDownload}>下载当前页面截图</Button>
            <Button type="primary" onClick={handleDownloadAllImage}>下载所有截图</Button>
          </Item>



        </Form>
      </div>
      <div className="bottom-content">
        <ImageList list={list} />
        <div className="page-wrap">
          <Pagination showSizeChanger current={page} pageSize={pageSize} total={total} onChange={handlePageChange} />
        </div>
      </div>

      <Modal title="设置Cookie" visible={isModalVisible} onCancel={() => hideModal()} onOk={saveContent}>
        <TextArea ref={textEl} rows={4} value={cookies} onInput={handleCookieInput} />
      </Modal>

      <Modal title="设置QQ" visible={isQQModalVisible} onCancel={() => hideQQModal()} onOk={() => hideQQModal()}>
        <Input value={qq} onChange={handleQQInput} />
      </Modal>
    </div>
  )
}

export default App
