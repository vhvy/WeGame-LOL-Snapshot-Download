import { ChangeEvent, useState, useRef, useEffect } from 'react';
import { Modal, Button, Input, message, Form, Pagination, Select, Alert } from 'antd';
import usePage from "@/hooks/usePage";
import ImageList from '@/ImageList';
import useQuery from "@/hooks/useQuery";
import useArea from "@/hooks/useArea";
import { downloadImg, downloadZipFile, ImgBlob } from "@/utils/index";

const { TextArea } = Input;
const { Item } = Form;
const { Option } = Select;

enum CookieStatus {
  Empty,
  WaitValid,
  Success,
  Error
};


const getStatusAlert = (status: CookieStatus): React.ReactElement => {
  type AlrtType = "success" | "info" | "error";
  let message = "Cookie有效", type: AlrtType = "success";
  switch (status) {
    case CookieStatus.Empty:
      message = "尚未设置Cookie";
      type = "info";
      break;
    case CookieStatus.WaitValid:
      message = "正在验证Cookie";
      type = "info";
      break;
    case CookieStatus.Success:
      break;
    case CookieStatus.Error:
      message = "Cookie无效";
      type = "error";
      break;
  }


  return <Alert message={message} showIcon type={type} className="alert-custom" />;
}


function App() {

  const { page, pageSize, setPage, setPageSize } = usePage();

  const [isModalVisible, setVisible] = useState(false);

  const [isLoading, list, total, getData] = useQuery();

  const {
    areaData,
    areaTypeList,
    areaId,
    areaType,
    handleAreaChange,
    handleAreaTypeChange
  } = useArea();

  const [cookies, setCookie] = useState("");
  const [cookieStatus, setStatus] = useState(CookieStatus.Empty);
  // 0 => 没有Cookie
  // 1 => 正在验证
  // 2 => 状态正常
  // 3 => 状态异常

  const textEl = useRef(null);

  const hideModal = () => {
    setVisible(false);
  }

  const showModal = () => {
    setVisible(true);
  }

  const validCookies = () => {
    setStatus(CookieStatus.WaitValid);
    setTimeout(() => {
      setStatus(CookieStatus.Success);
    }, 2000);
  }

  const saveContent = () => {
    if (!cookies.trim()) {
      return message.warn("请输入Cookie!");
    }

    hideModal();
    message.success("设置成功!");
    validCookies();
  }

  const handleCookieInput = ({ target }: ChangeEvent<HTMLTextAreaElement>): void => {
    setCookie(target.value);
  }

  const handlePageChange = (_page: number, _pageSize: number) => {
    setPage(_page);
    setPageSize(_pageSize);
  }



  const handleQuery = () => {
    getData();
  }

  const handleDownload = async () => {
    let imgList = list.map(i => i.src);
    const msg = message.loading("正在下载图片...", 0);
    const blobs = await downloadImg(imgList);
    msg();
    const blobInfo: ImgBlob[] = blobs.map((blob, idx) => ({
      blob,
      name: idx + ".jpg"
    }));

    downloadZipFile(blobInfo);
  }

  return (
    <div className="wrapper">
      <div className="top-content">
        <Form labelCol={{ span: 3 }}>
          <Item label="设置Cookies">
            <div className="flex flex-center-y">
              <Button style={{ marginRight: 20 }} type="primary" onClick={showModal}>设置Cookies</Button>

              {
                getStatusAlert(cookieStatus)
              }
            </div>
          </Item>
          <Item label="选择大区">
            <Select value={areaType} onChange={handleAreaTypeChange} style={{ width: 120 }} maxTagTextLength={5}>
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
            <Button type="primary" onClick={handleDownload}>下载所有图片</Button>
          </Item>



        </Form>
      </div>
      <div className="bottom-content">
        <ImageList list={list} />
        <div className="page-wrap">
          <Pagination current={page} pageSize={pageSize} total={total} onChange={handlePageChange} />
        </div>
      </div>

      <Modal title="设置Cookie" visible={isModalVisible} onCancel={hideModal} onOk={saveContent}>
        <TextArea ref={textEl} rows={4} value={cookies} onInput={handleCookieInput} />
      </Modal>
    </div>
  )
}

export default App
